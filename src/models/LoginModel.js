import Network from '../utils/network.js';

/**
 * Login model
 */
export default class LoginModel {
    /**
     * Login model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
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
                this.eventBus.emit('loginModel:loginSuccess', null);
            }
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('loginModel:loginFailed', responseBody.codes);
            }
            return responseBody;
        });
    }
}
