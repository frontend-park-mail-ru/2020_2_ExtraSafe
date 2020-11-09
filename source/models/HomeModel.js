import BoardController from '../components/Board/BoardController.js';
import userSession from '../utils/userSession.js';

/**
 * Home model
 */
export default class HomeModel {
    /**
     * Home model constructor
     * @param {EventBus} eventBus
     * @param {Router} router
     */
    constructor(eventBus, router) {
        this.eventBus = eventBus;
        this.boards = [];
        this.router = router;
    }

    /**
     * add board from server
     * @param {HTMLElement} boardsDiv
     */
    addBoardsFromData(boardsDiv) {
        for (const board of userSession.boards) {
            this.addNewBoard(boardsDiv, this.router, board.boardID, board.name);
        }
    }

    /**
     * Add new board data
     * @param {HTMLElement} boardsDiv
     * @param {Router} router
     * @param {string} boardID
     * @param {string} boardName
     */
    addNewBoard(boardsDiv, router, boardID = '', boardName = '') {
        const newBoard = new BoardController(boardsDiv, router, this.boards.length, boardID, boardName);
        this.boards.push(newBoard);

        this.eventBus.emit('homeModel:boardAdded', newBoard);
    }
}
