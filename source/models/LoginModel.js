import Network from '../utils/network.js';
import eventBus from '../utils/eventBus.js';

/**
 * Login model
 */
export default class LoginModel {
    /**
     * Request to server
     */
    requestAuthorization() {
        const user = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };

        Network.loginRequest(user).then((response) => {
            if (response.ok) {
                eventBus.emit('loginModel:loginSuccess', null);
            }
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                eventBus.emit('loginModel:loginFailed', responseBody.codes);
            }
            return responseBody;
        });
    }
}
