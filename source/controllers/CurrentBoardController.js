import BaseController from './BaseController.js';
import CurrentBoardView from '../views/CurrentBoardView/CurrentBoardView.js';
import CurrentBoardModel from '../models/CurrentBoardModel.js';

/**
 * Current board controller
 * @typedef {Object} CurrentBoardController
 * @extends BaseController
 */
export default class CurrentBoardController extends BaseController {
    /**
     * Current board controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new CurrentBoardView(el, this.eventBus);
        this.model = new CurrentBoardModel(this.eventBus);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {}

    /**
     * Render view
     */
    render() {
        super.render();
        this.view.render();
    }
}
