import BaseController from '../../controllers/BaseController.js';
import TaskView from './TaskView.js';
import TaskModel from './TaskModel.js';
import TaskDetailedController from '../TaskDetailed/TaskDetailedController.js';

/**
 * Task controller
 * @typedef {Object} CardController
 * @extends BaseController
 */
export default class TaskController extends BaseController {
    /**
     * Task controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {number} taskNumber
     * @param {string} taskID
     * @param {string} taskName
     * @param {string} taskDescription
     * @param {string} contentEditable
     */
    constructor(el, taskNumber, taskID = '', taskName = '',
        taskDescription = '', contentEditable = 'true') {
        super(el);
        this.view = new TaskView(el, this.eventBus);
        this.model = new TaskModel(this.eventBus, taskNumber, el.id, taskID,
            taskName, taskDescription, contentEditable);
        const taskDetailedDiv = document.getElementById('taskDetailed');
        this.taskDetailed = new TaskDetailedController(taskDetailedDiv);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('taskView:updateTaskName', (newName) => {
            this.model.updateTaskName(newName);
        });
        this.eventBus.on('taskModel:taskNameUpdated', (taskJSON) => {
            this.view.onTaskNameUpdated(taskJSON);
        });
        this.eventBus.on('taskView:openTaskDetailed', (task) => {
            this.taskDetailed.render(task);
        });
        this.taskDetailed.eventBus.on('taskDetailedController:taskNameUpdated', () => {
            this.view.updateTaskName(this.model.task);
        });
        this.taskDetailed.eventBus.on('taskDetailedView:deleteTask', () => {
            this.view.deleteTask(this.model.task);
            delete this;
        });
    }

    /**
     * Render task
     */
    render() {
        this.view.render(this.model.task);
        this.addEventListeners();
    }
}
