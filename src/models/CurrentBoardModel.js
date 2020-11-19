import network from '../utils/network.js';

/**
 * Current board model
 */
export default class CurrentBoardModel {
    /**
     * Current board model constructor
     * @param {EventBus} eventBus
     * @param {string} boardName
     * @param {string} boardID
     */
    constructor(eventBus, boardName, boardID) {
        this.eventBus = eventBus;
        this.board = {
            boardID: boardID,
            boardName: boardName,
            boardCollaborators: [],
        };
    }

    /**
     * send request to server to get data of board
     */
    getBoardData() {
        network.boardGet(this.board.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.getBoardData();
                    return;
                }
                this.eventBus.emit('currentBoardModel:getBoardFailed', responseBody.codes);
            } else {
                this.board.boardID = responseBody.boardID;
                this.board.boardName = responseBody.name;
                this.eventBus.emit('currentBoardModel:getBoardSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Update board name
     * @param {string} boardName
     */
    updateBoardName(boardName) {
        this.board.boardName = boardName;

        const data = {
            boardName: boardName,
            boardID: this.board.boardID,
        };
        network.boardSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.updateBoardName(boardName);
                    return;
                }
                this.eventBus.emit('currentBoardModel:boardSetFailed', responseBody.codes);
            } else {
                this.eventBus.emit('currentBoardModel:boardSetSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Delete board
     */
    deleteBoard() {
        network.boardDelete(this.board.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.deleteBoard();
                    return;
                }
            } else {
                this.eventBus.emit('currentBoardModel:boardDeleted', null);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Change card order on server
     * @param {[JSON]} cards
     */
    changeCardOrderOnServer(cards) {
        const data = {cards: cards};
        network.cardsOrder(data, this.board.boardID).then((response) => {});
    }
}
