import CardController from '../components/Card/CardController.js';
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
            cards: [],
        };
        this.newCard = {
            boardID: boardID,
            cardID: 0,
            cardName: '',
            isInitialized: false,
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
                this.eventBus.emit('currentBoardModel:getBoardSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * set board params received from server
     * @param {JSON} responseJSON
     */
    setBoardData(responseJSON) {
        this.board.boardID = responseJSON.boardID;
        this.board.boardName = responseJSON.name;
        this.addCardsFromJSON(responseJSON.cards);
        this.eventBus.emit('currentBoardModel:boardDataSet', this.board);
    }

    /**
     * Add new card
     * @param {HTMLElement} cardsDiv
     * @param {object} card
     * @return {CardController}
     */
    addNewCard(cardsDiv, card = this.newCard) {
        const newCard = new CardController(cardsDiv, this.board.cards.length, card);
        this.board.cards.push(newCard);

        this.eventBus.emit('currentBoardModel:cardAdded', newCard);
        return newCard;
    }

    /**
     * create cards from server
     * @param {[JSON]}cardsJSON
     */
    addCardsFromJSON(cardsJSON) {
        if (!(Array.isArray(cardsJSON) && cardsJSON.length)) {
            return;
        }

        for (const card of cardsJSON) {
            const cardObj = {
                boardID: this.board.boardID,
                cardID: card.cardID,
                cardName: card.name,
                isInitialized: true,
            };
            const newCard = this.addNewCard(this.cardsDiv, cardObj);
            newCard.addTasksFromJSON(card.tasks);
        }
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
}
