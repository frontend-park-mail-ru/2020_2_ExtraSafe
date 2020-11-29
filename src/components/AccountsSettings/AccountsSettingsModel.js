import Network from '../../utils/network.js';
import userSession from '../../utils/userSession.js';

/**
 * Accounts settings model
 */
export default class AccountsSettingsModel {
    /**
     * Accounts settings model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
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
            userSession.setAccounts(responseBody);
            this.eventBus.emit('accountsSettingsModel:changeSuccess', null);
            return responseBody;
        });
    }
}
