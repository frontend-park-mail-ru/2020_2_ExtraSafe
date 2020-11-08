import TaskController from '../Task/TaskController.js';

/**
 * Card model
 */
export default class CardModel {
    /**
     * Card model constructor
     * @param {EventBus} eventBus
     * @param {number} cardNumber
     */
    constructor(eventBus, cardNumber) {
        this.eventBus = eventBus;
        this.card = {
            cardName: '',
            cardID: `card${cardNumber}`,
            cardNameID: `cardName${cardNumber}`,
            cardSettingsID: `cardSettings${cardNumber}`,
            addTaskID: `addTask${cardNumber}`,
            tasksDiv: `tasksDiv${cardNumber}`,
            tasks: [],
        };
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
     * @param {Router} router
     */
    addNewTask(tasksDiv, router) {
        const newTask = new TaskController(tasksDiv, router, this.card.tasks.length);
        this.card.tasks.push(newTask);

        this.eventBus.emit('cardModel:taskAdded', newTask);
    }
}
