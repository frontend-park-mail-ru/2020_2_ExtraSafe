import BaseController from './BaseController.js';
import SettingsView from '../views/SettingsView/SettingsView.js';
import SettingsModel from '../models/SettingsModel.js';
import ProfileSettingsController from '../components/ProfileSettings/ProfileSettingsController.js';
import AccountsSettingsController from '../components/AccountsSettings/AccountsSettingsController.js';
import SecuritySettingsController from '../components/SecuritySettings/SecuritySettingsController.js';

/**
 * Settings controller
 * @typedef {Object} SettingsController
 * @extends BaseController
 */
export default class SettingsController extends BaseController {
    /**
     * Settings controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new SettingsView(el, this.eventBus);
        this.model = new SettingsModel(this.eventBus);

        this.profileSettings = new ProfileSettingsController(el, router);
        this.accountsSettings = new AccountsSettingsController(el, router);
        this.securitySettings = new SecuritySettingsController(el, router);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('settingsView:renderProfile', (input) => {
            this.profileSettings.view.el = input;
            this.profileSettings.render();
        });
        this.eventBus.on('settingsView:renderAccounts', (input) => {
            this.accountsSettings.view.el = input;
            this.accountsSettings.render();
        });
        this.eventBus.on('settingsView:renderSecurity', (input) => {
            this.securitySettings.view.el = input;
            this.securitySettings.render();
        });
    }

    /**
     * Render view
     */
    render() {
        super.render();
        this.view.render();
    }
}
