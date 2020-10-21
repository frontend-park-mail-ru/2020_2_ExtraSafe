import Network from '../../utils/network.js';
import eventBus from '../../utils/eventBus.js';

/**
 * Security settings model
 */
export default class SecuritySettingsModel {
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
                eventBus.emit('securitySettingsModel:changeFailed', responseBody.codes);
            } else {
                eventBus.emit('securitySettingsModel:changeSuccess', null);
            }
            return responseBody;
        });
    }
}
