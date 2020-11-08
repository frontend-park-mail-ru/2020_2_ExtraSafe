import BaseController from './BaseController.js';
import HomeView from '../views/HomeView/HomeView.js';
import HomeModel from '../models/HomeModel.js';

/**
 * Home controller
 * @typedef {Object} HomeController
 * @extends BaseController
 */
export default class HomeController extends BaseController {
    /**
     * Home controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new HomeView(el, this.eventBus);
        this.model = new HomeModel(this.eventBus);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('homeView:addBoard', (boardsDiv) => {
            this.model.addNewBoard(boardsDiv);
        });
        this.eventBus.on('homeModel:boardAdded', (board) => {
            this.view.renderBoard(board);
        });
    }

    /**
     * Render view
     */
    render() {
        super.render();
        this.view.render();
    }
}
