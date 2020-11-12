import Network from '../../utils/network.js';
import userSession from '../../utils/userSession.js';
import network from '../../utils/network.js';

/**
 * Profile settings model
 */
export default class ProfileSettingsModel {
    /**
     * Profile settings model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    /**
     * Change user profile
     */
    changeParams() {
        const formData = new FormData();
        formData.append('username', document.getElementById('username').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('fullName', document.getElementById('fullName').value);
        formData.append('avatar', document.getElementById('imageInput').files[0]);

        Network.profileSet(formData).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.changeParams();
                    return;
                }
                this.eventBus.emit('profileSettingsModel:changeFailed', responseBody.codes);
            } else {
                userSession.setData(responseBody);
                this.eventBus.emit('profileSettingsModel:changeSuccess', null);
            }
            return responseBody;
        });
    }
}
