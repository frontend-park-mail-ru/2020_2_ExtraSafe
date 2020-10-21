import BaseController from './BaseController.js';
import eventBus from '../utils/eventBus.js';
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
        this.view = new SettingsView(el);
        this.model = new SettingsModel();

        this.profileSettings = new ProfileSettingsController(el);
        this.accountsSettings = new AccountsSettingsController(el);
        this.securitySettings = new SecuritySettingsController(el);

        eventBus.on('settingsView:renderProfile', (input) => {
            this.profileSettings.view.el = input;
            this.profileSettings.view.render();
        });
        eventBus.on('settingsView:renderAccounts', (input) => {
            this.accountsSettings.view.el = input;
            this.accountsSettings.view.render();
        });
        eventBus.on('settingsView:renderSecurity', (input) => {
            this.securitySettings.view.el = input;
            this.securitySettings.view.render();
        });
    }
}
