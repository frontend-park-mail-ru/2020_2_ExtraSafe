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
     * @param {Router} router
     * @param {number} cardNumber
     */
    constructor(el, router, cardNumber) {
        super(el, router);
        this.view = new CardView(el, this.eventBus);
        this.model = new CardModel(this.eventBus, cardNumber);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('cardView:updateCardName', (newName) => {
            this.model.updateCardName(newName);
        });
        this.eventBus.on('cardView:addNewTask', (tasksDiv) => {
            this.model.addNewTask(tasksDiv, this.router);
        });
        this.eventBus.on('cardModel:taskAdded', (newTask) => {
            this.view.renderTask(newTask);
        });
    }

    /**
     * Render card
     */
    render() {
        this.view.render(this.model.card);
        this.addEventListeners();
    }
}
