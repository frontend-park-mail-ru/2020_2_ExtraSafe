import BaseController from '../../controllers/BaseController.js';
import BoardView from './BoardView.js';
import BoardModel from './BoardModel.js';

/**
 * Board controller
 * @typedef {Object} BoardController
 * @extends BaseController
 */
export default class BoardController extends BaseController {
    /**
     * Board controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     * @param {number} boardNumber
     * @param {string} boardID
     * @param {string} boardName
     */
    constructor(el, router, boardNumber, boardID = '', boardName = '') {
        super(el, router);
        this.view = new BoardView(el, this.eventBus);
        this.model = new BoardModel(this.eventBus, boardNumber, boardID, boardName);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('boardView:openBoard', () => {
            this.router.open(`/board/${this.model.boardJSON.boardID}`);
        });
    }

    /**
     * Render board
     */
    render() {
        this.addEventListeners();
        this.view.render(this.model.board);
    }
}
