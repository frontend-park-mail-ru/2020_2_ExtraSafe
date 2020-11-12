import BaseController from '../../controllers/BaseController.js';
import CardView from './CardView.js';
import CardModel from './CardModel.js';
import globalEventBus from '../../utils/globalEventBus.js';

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
     * @param {object} card
     */
    constructor(el, cardNumber, card) {
        super(el);
        this.view = new CardView(el, this.eventBus);
        this.model = new CardModel(this.eventBus, cardNumber, card);
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
        this.eventBus.on('cardView:deleteCard', () => {
            this.model.deleteCard();
            delete this;
        });
        this.eventBus.on('cardModel:createCardFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('cardModel:createCardSuccess', (data) => {
            console.log(data);
        });
        this.eventBus.on('cardModel:setCardFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('cardModel:setCardSuccess', (data) => {
            console.log(data);
        });
        this.eventBus.on('cardModel:changeTaskOrderOnServerFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('cardModel:changeTaskOrderOnServerSuccess', (data) => {
            console.log(data);
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

        const el = document.getElementById(this.model.card.tasksDiv);
        globalEventBus.on('taskView:taskPositionChanged', () => {
            if ((window.draggedTask.parentElement === window.startTasksDiv) && (window.startTasksDiv === el)) {
                this.model.changeTaskOrder(window.draggedTask);
                this.model.changeTaskOrderOnServer();
            } else {
                if (window.startTasksDiv === el) {
                    const deletedCardData = this.model.card.tasks[Number.parseInt(window.draggedTask.dataset.order)];
                    this.model.deleteTask(window.draggedTask);
                    globalEventBus.emit('cardController:taskRemovedFromOldCard', [deletedCardData, this.model]);
                }
            }
        });
        globalEventBus.on('cardController:taskRemovedFromOldCard', ([deletedCardData, oldCardModel]) => {
            if (window.draggedTask.parentElement === el) {
                this.model.addTask(window.draggedTask, deletedCardData);
                this.model.changeTaskMultiCardOrderOnServer(oldCardModel);
            }
        });
    }
}
