import BaseController from '../../controllers/BaseController.js';
import TaskView from './TaskView.js';
import TaskModel from './TaskModel.js';
import TaskDetailedController from '../TaskDetailed/TaskDetailedController.js';

/**
 * Task controller
 * @typedef {Object} TaskController
 * @extends BaseController
 */
export default class TaskController extends BaseController {
    /**
     * Task controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {number} taskNumber
     * @param {object} task
     */
    constructor(el, taskNumber, task) {
        super(el);
        this.view = new TaskView(el, this.eventBus);
        this.model = new TaskModel(this.eventBus, taskNumber, el.id, task);
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
            this.model.createTaskForServer();
        });
        this.eventBus.on('taskView:openTaskDetailed', (task) => {
            this.taskDetailed.render(task);
        });
        this.taskDetailed.eventBus.on('taskDetailedController:taskNameUpdated', () => {
            this.view.updateTaskName(this.model.task);
        });
        this.taskDetailed.eventBus.on('taskDetailedView:deleteTask', () => {
            this.view.deleteTask(this.model.task);
            this.model.deleteTask();
            delete this;
        });
        this.taskDetailed.eventBus.on('taskDetailedView:closed', () => {
            this.model.updateTaskForServer();
        });
        this.eventBus.on('taskModel:createTaskFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('taskModel:createTaskSuccess', (data) => {
            console.log(data);
        });
        this.eventBus.on('taskModel:setTaskFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('taskModel:setTaskSuccess', (data) => {
            console.log(data);
        });
    }

    /**
     * Render task
     */
    render() {
        this.addEventListeners();
        this.view.render(this.model.task);
    }
}
