import SecuritySettingsView from './SecuritySettingsView.js';
import SecuritySettingsModel from './SecuritySettingsModel.js';
import BaseController from '../../controllers/BaseController.js';

/**
 * Security settings controller
 * @typedef {Object} AccountsSettingsController
 */
export default class SecuritySettingsController extends BaseController {
    /**
     * Security settings controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new SecuritySettingsView(el, this.eventBus);
        this.model = new SecuritySettingsModel(this.eventBus);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('securitySettingsView:formSubmit', () => {
            this.model.changeParams();
        });
        this.eventBus.on('securitySettingsModel:changeSuccess', () => {
            this.view.showServerSuccess();
        });
        this.eventBus.on('securitySettingsModel:changeFailed', (input) => {
            this.view.showServerError(input);
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
