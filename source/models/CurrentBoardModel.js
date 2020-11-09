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
     */
    constructor(eventBus, boardName) {
        this.eventBus = eventBus;
        this.board = {
            boardID: '',
            boardName: boardName,
            boardCollaborators: [],
            cards: [],
        };
        this.newCard = {
            boardID: 1,
            cardID: 0,
            cardName: '',
            isInitialized: false,
        };
    }

    /**
     * send request to server to get data of board
     */
    getBoardData() {
        network.boardGet('1').then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('currentBoardModel:getBoardFailed', responseBody.codes);
            } else {
                this.eventBus.emit('currentBoardModel:getBoardSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * create cards from server
     * @param {[JSON]}cardsJSON
     */
    addCardsFromJSON(cardsJSON) {
        // TODO - сделать обработку ситуации, когда нет карточек
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
     * Update card name
     * @param {string} cardID
     * @param {string} newName
     */
    updateCardName(cardID, newName) {
        const id = getIDFromString(cardID) - 1;
        this.board.cards[id].taskName = newName;
    }

    /**
     * Update task name
     * @param {string} cardID
     * @param {string} taskID
     * @param {string} newName
     */
    updateTaskName(cardID, taskID, newName) {
        const taskJSON = this.board.cards[getIDFromString(cardID)].tasks[getIDFromString(taskID)];
        taskJSON.taskName = newName;
        taskJSON.contentEditable = 'false';

        this.eventBus.emit('currentBoardModel:taskNameUpdated', taskJSON);
    }
}

/**
 * Get number id from string id
 * @param {string} string
 * @return {number}
 */
function getIDFromString(string) {
    return parseInt(string.replace(/\D/g, ''));
}
