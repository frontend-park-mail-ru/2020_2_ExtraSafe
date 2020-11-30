import Network from '../../utils/network.js';
import network from '../../utils/network.js';

/**
 * Security settings model
 */
export default class SecuritySettingsModel {
    /**
     * Security settings model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    /**
     * Change user password
     */
    changeParams() {
        const data = {
            oldpassword: document.getElementById('oldPassword').value,
            password: document.getElementById('password').value,
        };

        Network.passwordSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.changeParams();
                    return;
                }
                this.eventBus.emit('securitySettingsModel:changeFailed', responseBody.codes);
            } else {
                this.eventBus.emit('securitySettingsModel:changeSuccess', null);
            }
            return responseBody;
        });
    }
}
