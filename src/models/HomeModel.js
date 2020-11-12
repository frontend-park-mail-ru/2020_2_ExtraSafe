import BoardController from '../components/Board/BoardController.js';
import network from '../utils/network.js';

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
        network.getBoards().then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('homeModel:getBoardsFromServerFailed', responseBody.codes);
            } else {
                for (const board of responseBody.boards) {
                    this.addNewBoard(boardsDiv, this.router, board.boardID, board.name);
                }
            }
            return responseBody;
        });
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

    /**
     * Add new board and send it to server
     * @param {string} boardName
     */
    addNewBoardOnServer(boardName) {
        const data = {
            boardName: boardName,
        };
        network.boardCreate(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('homeModel:boardCreateFailed', responseBody.codes);
            } else {
                this.eventBus.emit('homeModel:boardCreateSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Get boards from server
     */
    getBoardsFromServer() {
        network.getBoards().then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('homeModel:getBoardsFromServerFailed', responseBody.codes);
            } else {
                this.eventBus.emit('homeModel:getBoardsFromServerSuccess', responseBody);
            }
            return responseBody;
        });
    }
}
