import BaseController from './BaseController.js';
import HomeView from '../views/HomeView/HomeView.js';
import HomeModel from '../models/HomeModel.js';
import AddBoardPopup from '../components/AddBoardPopup/AddBoardPopup.js';

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
        this.eventBus.on('homeView:addBoard', () => {
            this.addBoardPopup.render();
        });
        this.eventBus.on('homeModel:boardCreateFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('homeModel:boardCreateSuccess', (data) => {
            console.log(data);
            // TODO: запрос на новые доски
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

        this.addBoardPopup = new AddBoardPopup(document.getElementById('addBoardPopup'));
        this.addBoardPopup.eventBus.on('addBoardPopup:addBoard', (boardName) => {
            this.model.addNewBoardOnServer(boardName);
        });
    }
}
