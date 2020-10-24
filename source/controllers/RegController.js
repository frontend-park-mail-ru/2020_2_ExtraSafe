import eventBus from '../utils/eventBus.js';
import BaseController from './BaseController.js';
import RegView from '../views/RegView/RegView.js';
import RegModel from '../models/RegModel.js';
import Rendering from '../utils/rendering.js';

/**
 * Reg controller
 */
export default class RegController extends BaseController {
    /**
     * Reg controller constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new RegView(el);
        this.model = new RegModel();

        eventBus.on('regView:formSubmit', () => {
            this.model.registrationRequest();
        }, 'RegController');
        eventBus.on('regModel:regSuccess', () => {
            this.router.open('/');
        }, 'RegController');
        eventBus.on('regModel:regFailed', (input) => {
            Rendering.printServerErrors(input);
        }, 'RegController');
    }
}
