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
        this.profileLinkAdaptive.className = 'adaptive-navigation__element adaptive-navigation__element_active';
        this.securityLink.className = 'navigation__element';
        this.securityLinkAdaptive.className = 'adaptive-navigation__element';
        this.eventBus.emit('settingsView:renderProfile', this.settingsBody);
    }

    /**
     * Render security settings
     */
    renderSecuritySettings() {
        this.profileLink.className = 'navigation__element';
        this.profileLinkAdaptive.className = 'adaptive-navigation__element';
        this.securityLink.className = 'navigation__element_active';
        this.securityLinkAdaptive.className = 'adaptive-navigation__element adaptive-navigation__element_active';
        this.eventBus.emit('settingsView:renderSecurity', this.settingsBody);
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        this.profileLink.addEventListener('click', this.renderProfileSettings.bind(this), false);
        this.securityLink.addEventListener('click', this.renderSecuritySettings.bind(this), false);
        this.profileLinkAdaptive.addEventListener('click', this.renderProfileSettings.bind(this), false);
        this.securityLinkAdaptive.addEventListener('click', this.renderSecuritySettings.bind(this), false);
    }

    /**
     * Render Profile view.
     */
    render() {
        Navbar.navbarShow();
        this.el.innerHTML = settingsViewTemplate();

        this.profileLink = document.getElementById('profileLink');
        this.securityLink = document.getElementById('securityLink');
        this.settingsBody = document.getElementById('settingsBody');

        this.profileLinkAdaptive = document.getElementById('profileLinkAdaptive');
        this.securityLinkAdaptive = document.getElementById('securityLinkAdaptive');

        this.addEventListeners();
        this.renderProfileSettings();
    }
}
