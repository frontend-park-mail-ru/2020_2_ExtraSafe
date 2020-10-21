import Network from '../../utils/network.js';
import eventBus from '../../utils/eventBus.js';

/**
 * Accounts settings model
 */
export default class AccountsSettingsModel {
    /**
     * Change user accounts on server
     */
    changeParams() {
        const data = {
            telegram: document.getElementById('telegram').value,
            instagram: document.getElementById('instagram').value,
            github: document.getElementById('github').value,
            bitbucket: document.getElementById('bitbucket').value,
            vkontakte: document.getElementById('vkontakte').value,
            facebook: document.getElementById('facebook').value,
        };

        Network.accountsSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            eventBus.emit('accountsSettingsModel:changeSuccess', responseBody);
            return responseBody;
        });
    }
}
