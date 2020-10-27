import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';

import './SettingsView.tmpl.js';

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
        this.profileLink.className = 'active-profile-nav';
        this.accountsLink.className = 'profile-nav';
        this.securityLink.className = 'profile-nav';
        this.eventBus.emit('settingsView:renderProfile', this.settingsBody);
    }

    /**
     * Render accounts settings
     */
    renderAccountsSettings() {
        this.profileLink.className = 'profile-nav';
        this.accountsLink.className = 'active-profile-nav';
        this.securityLink.className = 'profile-nav';
        this.eventBus.emit('settingsView:renderAccounts', this.settingsBody);
    }

    /**
     * Render security settings
     */
    renderSecuritySettings() {
        this.profileLink.className = 'profile-nav';
        this.accountsLink.className = 'profile-nav';
        this.securityLink.className = 'active-profile-nav';
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
        this.el.innerHTML = window.fest['views/SettingsView/SettingsView.tmpl']();

        this.profileLink = document.getElementById('profileLink');
        this.accountsLink = document.getElementById('accountsLink');
        this.securityLink = document.getElementById('securityLink');
        this.settingsBody = document.getElementById('settingsBody');

        this.addEventListeners();
        this.renderProfileSettings();
    }
}
