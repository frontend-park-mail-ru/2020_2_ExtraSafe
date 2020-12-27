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
        this.router = router;
        this.boards = [];
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

    // TODO: переделать под шаблоны
    /**
     * Add new board from tmpl and send it to server
     * @param {Object} boardData
     */
    addNewBoardOnServerFromTmpl(boardData) {
        const data = {
            boardName: boardData.boardName,
            templateSlug: boardData.boardID,
        };
        network.boardCreateFromTmpl(data).then((response) => {
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
