import BaseController from '../../controllers/BaseController.js';
import TaskDetailedModel from './TaskDetailedModel.js';
import TaskDetailedView from './TaskDetailedView.js';
import TagAddPopup from './TagAddPopup/TagAddPopup.js';
// import TagCreatePopup from './TagCreatePopup/TagCreatePopup.js';

/**
 * Task detailed controller
 */
export default class TaskDetailedController extends BaseController {
    /**
     * Task detailed controller constructor
     * @param {HTMLElement} el
     */
    constructor(el) {
        super(el);
        this.model = new TaskDetailedModel(this.eventBus);
        this.view = new TaskDetailedView(el, this.eventBus);
        // this.tagCreatePopup = new TagCreatePopup(tagPopupEl);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('taskDetailedView:updateTaskDescription', (newDescription) => {
            this.model.updateTaskDescription(newDescription);
        });
        this.eventBus.on('taskDetailedView:updateTaskName', (newTaskName) => {
            this.model.updateTaskName(newTaskName);
            this.eventBus.emit('taskDetailedController:taskNameUpdated', null);
        });
        this.eventBus.on('taskDetailedView:addTag', () => {
            this.tagAddPopup.render(this.model.task.tags, this.model.board.boardTags);
        });
    }

    /**
     * Add event listeners related to tags
     */
    addTagEventListeners() {
        this.tagAddPopup.eventBus.on('tagAddPopup:tagAdded', (tag) => {
            this.model.addTag(tag);
            this.view.addTag(tag);
            this.eventBus.emit('tagDetailedController:tagAdded', tag);
        });
        this.tagAddPopup.eventBus.on('tagAddPopup:tagRemoved', (tag) => {
            this.model.removeTag(tag);
            this.view.removeTag(tag);
            this.eventBus.emit('tagDetailedController:tagRemoved', tag);
        });
    }

    /**
     * Render task detailed view
     * @param {Object} board
     * @param {Object} task
     */
    render(board, task) {
        this.model.task = task;
        this.model.board = board;
        this.view.render(task);
        this.addEventListeners();

        const tagPopupEl = document.getElementById('tagPopup');
        this.tagAddPopup = new TagAddPopup(tagPopupEl);
        this.addTagEventListeners();
    }
}
