import CardController from '../components/Card/CardController.js';

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
     * Add new card
     * @param {HTMLElement} cardsDiv
     * @param {Router} router
     */
    addNewCard(cardsDiv, router) {
        const newCard = new CardController(cardsDiv, router, this.board.cards.length);
        this.board.cards.push(newCard);

        this.eventBus.emit('currentBoardModel:cardAdded', newCard);
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
