import BaseController from './BaseController.js';
import CurrentBoardView from '../views/CurrentBoardView/CurrentBoardView.js';
import CurrentBoardModel from '../models/CurrentBoardModel.js';
import TaskDetailedController from '../components/TaskDetailed/TaskDetailedController.js';
import globalEventBus from '../utils/globalEventBus.js';

/**
 * Current board controller
 * @typedef {Object} CurrentBoardController
 * @extends BaseController
 */
export default class CurrentBoardController extends BaseController {
    /**
     * Current board controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new CurrentBoardView(el, this.eventBus);
        this.model = new CurrentBoardModel(this.eventBus);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('currentBoardView:addNewCard', () => {
            this.model.addNewCard();
        });
        this.eventBus.on('currentBoardModel:cardAdded', ([cards, cardNameID]) => {
            this.view.renderCards(cards);
            document.getElementById(cardNameID).focus();
        });
        this.eventBus.on('currentBoardView:updateCardName', ([cardID, newName]) => {
            this.model.updateCardName(cardID, newName);
        });
        this.eventBus.on('currentBoardView:addNewTask', (cardID) => {
            this.model.addNewTask(cardID);
        });
        this.eventBus.on('currentBoardModel:taskAdded', ([cards, taskNameID]) => {
            this.view.renderCards(cards);
            document.getElementById(taskNameID).focus();
        });
        this.eventBus.on('currentBoardView:updateTaskName', ([cardID, taskID, newName]) => {
            this.model.updateTaskName(cardID, taskID, newName);
        });
        this.eventBus.on('currentBoardModel:taskNameUpdated', (task) => {
            this.view.onTaskNameUpdated(task);
        });
        this.eventBus.on('currentBoardView:openTaskDetailed', (task) => {
            this.taskDetailed.render(task);
        });
        globalEventBus.on('taskDetailedView:closed', () => {
            this.view.renderCards(this.model.cards);
        });
    }

    /**
     * Render view
     */
    render() {
        super.render();
        this.view.render();
        this.taskDetailed = new TaskDetailedController(document.getElementById('taskDetailed'), this.router);
    }
}
