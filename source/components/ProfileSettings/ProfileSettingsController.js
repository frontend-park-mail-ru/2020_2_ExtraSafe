import ProfileSettingsView from './ProfileSettingsView.js';
import ProfileSettingsModel from './ProfileSettingsModel.js';
import globalEventBus from '../../utils/globalEventBus.js';
import BaseController from '../../controllers/BaseController.js';

/**
 * Profile settings controller
 * @typedef {Object} ProfileSettingsController
 */
export default class ProfileSettingsController extends BaseController {
    /**
     * Profile settings controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new ProfileSettingsView(el, this.eventBus);
        this.model = new ProfileSettingsModel(this.eventBus);
    }

    /**
     * Add all global event listeners
     */
    addGlobalEventListeners() {
        globalEventBus.on('userSession:set', (input) => {
            this.eventBus.emit('userSession:set', input);
        });
    };

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('profileSettingsView:formSubmit', () => {
            this.model.changeParams();
        });
        this.eventBus.on('profileSettingsModel:changeSuccess', () => {
            this.view.showServerSuccess();
        });
        this.eventBus.on('profileSettingsModel:changeFailed', (input) => {
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
