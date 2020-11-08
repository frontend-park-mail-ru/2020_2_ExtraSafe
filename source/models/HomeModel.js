import BoardController from '../components/Board/BoardController.js';

/**
 * Home model
 */
export default class HomeModel {
    /**
     * Home model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.boards = [];
    }

    /**
     * Add new board data
     * @param {HTMLElement} boardsDiv
     * @param {string} boardID
     * @param {string} boardName
     */
    addNewBoard(boardsDiv, boardID = '', boardName = '') {
        const newBoard = new BoardController(boardsDiv, this.boards.length, boardID, boardName);
        this.boards.push(newBoard);

        this.eventBus.emit('homeModel:boardAdded', newBoard);
    }
}
