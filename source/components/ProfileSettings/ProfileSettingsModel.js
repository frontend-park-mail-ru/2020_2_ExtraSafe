import Network from '../../utils/network.js';
import userSession from '../../utils/userSession.js';
import eventBus from '../../utils/eventBus.js';

/**
 * Profile settings model
 */
export default class ProfileSettingsModel {
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
                eventBus.emit('profileSettingsModel:changeFailed', responseBody.codes);
            } else {
                userSession.setData(responseBody);
                eventBus.emit('profileSettingsModel:changeSuccess', null);
            }
            return responseBody;
        });
    }
}
