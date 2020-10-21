import Network from '../utils/network.js';
import eventBus from '../utils/eventBus.js';

/**
 * Reg model
 */
export default class RegModel {
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
                eventBus.emit('regModel:regSuccess', null);
            }
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                eventBus.emit('regModel:regFailed', responseBody.codes);
            }
            return responseBody;
        });
    }
}
