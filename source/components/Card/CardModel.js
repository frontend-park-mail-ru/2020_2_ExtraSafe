import TaskController from '../Task/TaskController.js';

/**
 * Card model
 */
export default class CardModel {
    /**
     * Card model constructor
     * @param {EventBus} eventBus
     * @param {number} cardNumber
     * @param {string} cardID
     * @param {string} cardName
     */
    constructor(eventBus, cardNumber, cardID = '', cardName = '') {
        this.eventBus = eventBus;
        this.card = {
            cardName: cardName,
            cardID: `card${cardNumber}`,
            cardNameID: `cardName${cardNumber}`,
            cardSettingsID: `cardSettings${cardNumber}`,
            addTaskID: `addTask${cardNumber}`,
            tasksDiv: `tasksDiv${cardNumber}`,
            tasks: [],
        };
        this.cardJSON = {
            cardID: cardID,
            name: '',
            order: undefined,
            tasks: [],
        };
    }

    /**
     *
     * @param {[JSON]} tasksJSON
     */
    addTasksFromJSON(tasksJSON) {
        for (const task of tasksJSON) {
            this.addNewTask(this.tasksDiv, task.taskID, task.name, task.description, 'false');
        }
    }

    /**
     * Update card name data
     * @param {string} newName
     */
    updateCardName(newName) {
        this.card.cardName = newName;
    }

    /**
     * Add new task data
     * @param {HTMLElement} tasksDiv
     * @param {string} taskID
     * @param {string} taskName
     * @param {string} taskDescription
     * @param {string} contentEditable
     */
    addNewTask(tasksDiv, taskID = '', taskName = '', taskDescription = '',
        contentEditable = 'true') {
        const newTask = new TaskController(tasksDiv, this.card.tasks.length, taskID, taskName, taskDescription,
            contentEditable);
        this.card.tasks.push(newTask);

        this.eventBus.emit('cardModel:taskAdded', newTask);
    }
}
