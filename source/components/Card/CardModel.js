import TaskController from '../Task/TaskController.js';
import network from '../../utils/network.js';

/**
 * Card model
 */
export default class CardModel {
    /**
     * Card model constructor
     * @param {EventBus} eventBus
     * @param {number} cardNumber
     * @param {object} card
     */
    constructor(eventBus, cardNumber, card) {
        this.eventBus = eventBus;
        this.card = {
            cardName: card.cardName,
            cardID: `card${cardNumber}`,
            cardNameID: `cardName${cardNumber}`,
            cardSettingsID: `cardSettings${cardNumber}`,
            addTaskID: `addTask${cardNumber}`,
            tasksDiv: `tasksDiv${cardNumber}`,
            tasks: [],
            isInitialized: card.isInitialized,
        };
        this.cardJSON = {
            boardID: card.boardID,
            cardID: card.cardID,
            name: card.cardName,
            order: undefined,
        };
        this.newTask = {
            boardID: card.boardID,
            taskID: '',
            cardID: card.cardID,
            taskName: '',
            taskDescription: '',
            contentEditable: 'true',
            isInitialized: false,
        };
    }

    /**
     *
     * @param {[JSON]} tasksJSON
     */
    addTasksFromJSON(tasksJSON) {
        if (!(Array.isArray(tasksJSON) && tasksJSON.length)) {
            return;
        }

        for (const task of tasksJSON) {
            const taskObj = {
                boardID: this.cardJSON.boardID,
                taskID: task.taskID,
                taskName: task.name,
                cardID: this.cardJSON.cardID,
                taskDescription: task.description,
                contentEditable: 'false',
                isInitialized: true,
            };
            this.addNewTask(this.tasksDiv, taskObj);
        }
    }

    /**
     * Update card name data
     * @param {string} newName
     */
    updateCardName(newName) {
        this.card.cardName = newName;
        if (this.card.isInitialized) {
            this.updateCardForServer();
        } else {
            this.createCardForServer();
        }
        this.card.isInitialized = true;
    }

    /**
     * delete card on server
     */
    deleteCard() {
        network.cardDelete(this.cardJSON.cardID);
    }

    /**
     * Add new task data
     * @param {HTMLElement} tasksDiv
     * @param {object} task
     */
    addNewTask(tasksDiv, task = this.newTask) {
        const newTask = new TaskController(tasksDiv, this.card.tasks.length, task);
        this.card.tasks.push(newTask);

        this.eventBus.emit('cardModel:taskAdded', newTask);
    }

    /**
     * send request to server with new card
     */
    createCardForServer() {
        const data = {
            boardID: this.cardJSON.boardID,
            cardID: this.cardJSON.cardID,
            name: this.card.cardName,
        };
        network.cardCreate(data, this.cardJSON.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('cardModel:createCardFailed', responseBody.codes);
            } else {
                this.eventBus.emit('cardModel:createCardSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * send request to server with update card
     */
    updateCardForServer() {
        const data = {
            boardID: this.cardJSON.boardID,
            cardID: this.cardJSON.cardID,
            name: this.card.cardName,
        };
        network.cardSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('cardModel:setCardFailed', responseBody.codes);
            } else {
                this.eventBus.emit('cardModel:setCardSuccess', responseBody);
            }
            return responseBody;
        });
    }
}
