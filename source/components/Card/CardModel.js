/**
 * Card model
 */
import TaskController from '../Task/TaskController.js';

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
            tasks: [],
        };
    }

    updateCardName(newName) {
        this.card.cardName = newName;
    }

    addNewTask(tasksDiv, router) {
        const newTask = new TaskController(tasksDiv, router, this.card.tasks.length);
        this.card.tasks.push(newTask);

        this.eventBus.emit('cardModel:taskAdded', newTask);
    }
}
