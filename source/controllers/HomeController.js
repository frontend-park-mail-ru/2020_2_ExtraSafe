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
        this.model = new HomeModel(this.eventBus, router);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('homeView:addBoard', (boardsDiv) => {
            this.model.addNewBoard(boardsDiv);
            // TODO: открыть страницу новой доски, но только при создании пользователем
        });
        this.eventBus.on('homeModel:boardAdded', (board) => {
            this.view.renderBoard(board);
        });
        this.eventBus.on('homeView:addBoardsFromServer', (boardsDiv) => {
            this.model.addBoardsFromData(boardsDiv);
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
