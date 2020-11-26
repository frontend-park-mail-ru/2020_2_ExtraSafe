import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import settingsViewTemplate from './SettingsView.tmpl.xml';

/**
 * Settings view class
 */
export default class SettingsView extends BaseView {
    /**
     * Settings view constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * Render profile settings
     */
    renderProfileSettings() {
        this.profileLink.className = 'navigation__element_active';
        this.accountsLink.className = 'navigation__element';
        this.securityLink.className = 'navigation__element';
        this.eventBus.emit('settingsView:renderProfile', this.settingsBody);
    }

    /**
     * Render accounts settings
     */
    renderAccountsSettings() {
        this.profileLink.className = 'navigation__element';
        this.accountsLink.className = 'navigation__element_active';
        this.securityLink.className = 'navigation__element';
        this.eventBus.emit('settingsView:renderAccounts', this.settingsBody);
    }

    /**
     * Render security settings
     */
    renderSecuritySettings() {
        this.profileLink.className = 'navigation__element';
        this.accountsLink.className = 'navigation__element';
        this.securityLink.className = 'navigation__element_active';
        this.eventBus.emit('settingsView:renderSecurity', this.settingsBody);
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        this.profileLink.addEventListener('click', this.renderProfileSettings.bind(this), false);
        this.accountsLink.addEventListener('click', this.renderAccountsSettings.bind(this), false);
        this.securityLink.addEventListener('click', this.renderSecuritySettings.bind(this), false);
    }

    /**
     * Render Profile view.
     */
    render() {
        Navbar.navbarShow();
        this.el.innerHTML = settingsViewTemplate();

        this.profileLink = document.getElementById('profileLink');
        this.accountsLink = document.getElementById('accountsLink');
        this.securityLink = document.getElementById('securityLink');
        this.settingsBody = document.getElementById('settingsBody');

        this.addEventListeners();
        this.renderProfileSettings();
    }
}
