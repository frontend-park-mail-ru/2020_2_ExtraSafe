import Network from '../utils/network.js';

/**
 * Reg model
 */
export default class RegModel {
    /**
     * Reg model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    /**
     * Request to server
     */
    registrationRequest() {
        const user = {
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        };

        Network.regRequest(user).then((response) => {
            if (response.ok) {
                this.eventBus.emit('regModel:regSuccess', null);
            }
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('regModel:regFailed', responseBody.codes);
            }
            return responseBody;
        });
    }
}
