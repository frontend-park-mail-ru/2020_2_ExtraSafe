import AccountsSettingsView from './AccountsSettingsView.js';
import AccountsSettingsModel from './AccountsSettingsModel.js';
import BaseController from '../../controllers/BaseController.js';
import globalEventBus from '../../utils/globalEventBus.js';

/**
 * Accounts settings controller
 * @typedef {Object} AccountsSettingsController
 */
export default class AccountsSettingsController extends BaseController {
    /**
     * Accounts settings controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.model = new AccountsSettingsModel(this.eventBus);
        this.view = new AccountsSettingsView(el, this.eventBus);
    }

    /**
     * Add all global event listeners
     */
    addGlobalEventListeners() {
        globalEventBus.on('userSession:setAccounts', (input) => {
            this.eventBus.emit('userSession:setAccounts', input);
        });
    };

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('accountsSettingsView:formSubmit', () => {
            this.model.changeParams();
        });
        this.eventBus.on('accountsSettingsModel:changeSuccess', (input) => {
            this.view.showServerSuccess();
        });
    }

    /**
     * Render view
     */
    render() {
        this.addEventListeners();
        this.view.render();
    }
}
