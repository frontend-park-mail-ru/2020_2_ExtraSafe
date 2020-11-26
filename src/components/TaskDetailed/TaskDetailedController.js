import BaseController from '../../controllers/BaseController.js';
import TaskDetailedModel from './TaskDetailedModel.js';
import TaskDetailedView from './TaskDetailedView.js';
// import TagAddPopup from './TagAddPopup/TagAddPopup.js';
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
        // const tagPopupEl = document.getElementById('tagPopup');
        // this.tagAddPopup = new TagAddPopup(tagPopupEl);
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
    }

    /**
     * Render task detailed view
     * @param {JSON} json
     */
    render(json) {
        this.model.task = json;
        this.view.render(json);
        this.addEventListeners();
    }
}
