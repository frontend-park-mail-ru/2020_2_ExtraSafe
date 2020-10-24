import eventBus from '../../utils/eventBus.js';
import SecuritySettingsView from './SecuritySettingsView.js';
import SecuritySettingsModel from './SecuritySettingsModel.js';

/**
 * Security settings controller
 * @typedef {Object} AccountsSettingsController
 */
export default class SecuritySettingsController {
    /**
     * Security settings controller constructor
     * @constructor
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.view = new SecuritySettingsView(el);
        this.model = new SecuritySettingsModel();

        eventBus.on('securitySettingsView:formSubmit', () => {
            this.model.changeParams();
        }, 'SecuritySettingsController');
        eventBus.on('securitySettingsModel:changeSuccess', () => {
            this.view.showServerSuccess();
        }, 'SecuritySettingsController');
        eventBus.on('securitySettingsModel:changeFailed', (input) => {
            this.view.showServerError(input);
        }, 'SecuritySettingsController');
    }
}
