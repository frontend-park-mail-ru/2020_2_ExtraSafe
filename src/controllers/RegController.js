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
        this.view = new RegView(el, this.eventBus);
        this.model = new RegModel(this.eventBus);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('regView:formSubmit', () => {
            this.model.registrationRequest();
        });
        this.eventBus.on('regModel:regSuccess', () => {
            if (this.forwardUrl) {
                this.router.open(this.forwardUrl);
            } else {
                this.router.open('/');
            }
        });
        this.eventBus.on('regModel:regFailed', (input) => {
            Rendering.printServerErrors(input);
        });
    }

    /**
     * Render view
     * @param {string} forwardUrl
     */
    render(forwardUrl) {
        this.forwardUrl = forwardUrl;
        super.render();
        this.view.render(forwardUrl);
    }
}
