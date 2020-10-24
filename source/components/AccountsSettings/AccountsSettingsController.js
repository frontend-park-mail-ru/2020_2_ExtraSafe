import AccountsSettingsView from './AccountsSettingsView.js';
import AccountsSettingsModel from './AccountsSettingsModel.js';
import eventBus from '../../utils/eventBus.js';

/**
 * Accounts settings controller
 * @typedef {Object} AccountsSettingsController
 */
export default class AccountsSettingsController {
    /**
     * Accounts settings controller constructor
     * @constructor
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.view = new AccountsSettingsView(el);
        this.model = new AccountsSettingsModel();

        eventBus.on('accountsSettingsView:formSubmit', () => {
            this.model.changeParams();
        }, 'AccountsSettingsController');
        eventBus.on('accountsSettingsModel:changeSuccess', (input) => {
            this.view.setParams(input);
            this.view.showServerSuccess();
        }, 'AccountsSettingsController');
    }
}
