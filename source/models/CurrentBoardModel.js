import CardController from '../components/Card/CardController.js';
import network from '../utils/network.js';

/**
 * Current board model
 */
export default class CurrentBoardModel {
    /**
     * Current board model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.board = {
            boardID: '',
            boardName: 'Лучшая тестовая доска',
            boardCollaborators: [],
            cards: [],
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
     *
     * @param cardsJSON
     */
    addCardsFromJSON(cardsJSON) {
        for (const card of cardsJSON) {
            const newCard = this.addNewCard(this.cardsDiv, card.cardID, card.name);
            newCard.addTasksFromJSON(card.tasks);
        }
    }

    setBoardData(responseJSON) {
        this.board.boardID = responseJSON.boardID;
        this.board.boardName = responseJSON.name;
        this.addCardsFromJSON(responseJSON.cards);
        this.eventBus.emit('currentBoardModel:boardDataSet', this.board);
    }

    /**
     * Add new card
     * @param {HTMLElement} cardsDiv
     * @param {string} cardID
     * @param {string} cardName
     */
    addNewCard(cardsDiv, cardID = '', cardName = '') {
        const newCard = new CardController(cardsDiv, this.board.cards.length, cardID, cardName);
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
     * add new task
     * @param {string} cardID
     */
    addNewTask(cardID) {
        const id = ++this.board.cards[cardID].tasksCount;
        const taskID = `${cardID}Task${id}`;
        const taskNameID = `${taskID}Name`;

        const newTaskJSON = {
            taskName: '',
            taskID: taskID,
            taskNameID: taskNameID,
            contentEditable: 'true',
        };
        this.board.cards[getIDFromString(cardID)].tasks.push(newTaskJSON);

        this.eventBus.emit('currentBoardModel:taskAdded', newTaskJSON);
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
