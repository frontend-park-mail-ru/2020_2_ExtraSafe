import BaseController from '../../controllers/BaseController.js';
import CardView from './CardView.js';
import CardModel from './CardModel.js';

/**
 * Card controller
 * @typedef {Object} CardController
 * @extends BaseController
 */
export default class CardController extends BaseController {
    /**
     * Card controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {number} cardNumber
     * @param {string} cardID
     * @param {string} cardName
     */
    constructor(el, cardNumber, cardID = '', cardName = '') {
        super(el);
        this.view = new CardView(el, this.eventBus);
        this.model = new CardModel(this.eventBus, cardNumber, cardID, cardName);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('cardView:updateCardName', (newName) => {
            this.model.updateCardName(newName);
        });
        this.eventBus.on('cardView:addNewTask', (tasksDiv) => {
            this.model.addNewTask(tasksDiv);
        });
        this.eventBus.on('cardModel:taskAdded', (newTask) => {
            this.view.renderTask(newTask);
        });
        this.eventBus.on('cardView:addTasksFromServer', (tasksDiv) => {
            this.model.tasksDiv = tasksDiv;
        });
    }

    /**
     * create tasks from server
     * @param {JSON} tasksJSON
     */
    addTasksFromJSON(tasksJSON) {
        this.model.addTasksFromJSON(tasksJSON);
    }

    /**
     * Render card
     */
    render() {
        this.addEventListeners();
        this.view.render(this.model.card);
    }
}
