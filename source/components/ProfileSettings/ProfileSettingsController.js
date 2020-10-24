import eventBus from '../../utils/eventBus.js';
import ProfileSettingsView from './ProfileSettingsView.js';
import ProfileSettingsModel from './ProfileSettingsModel.js';

/**
 * Profile settings controller
 * @typedef {Object} ProfileSettingsController
 */
export default class ProfileSettingsController {
    /**
     * Profile settings controller constructor
     * @constructor
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.view = new ProfileSettingsView(el);
        this.model = new ProfileSettingsModel();

        eventBus.on('profileSettingsView:formSubmit', () => {
            this.model.changeParams();
        }, 'ProfileSettingsController');
        eventBus.on('profileSettingsModel:changeSuccess', () => {
            this.view.showServerSuccess();
        }, 'ProfileSettingsController');
        eventBus.on('profileSettingsModel:changeFailed', (input) => {
            this.view.showServerError(input);
        }, 'ProfileSettingsController');
    }
}
