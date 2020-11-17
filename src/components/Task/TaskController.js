import BaseController from '../../controllers/BaseController.js';
import TaskView from './TaskView.js';
import TaskModel from './TaskModel.js';
import TaskDetailedController from '../TaskDetailed/TaskDetailedController.js';
import globalEventBus from '../../utils/globalEventBus.js';

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
     * @param {object} task
     */
    constructor(el, task) {
        super(el);
        this.view = new TaskView(el, this.eventBus);
        this.model = new TaskModel(this.eventBus, task);
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
            this.model.createTaskForServer();
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
            this.model.deleteTask();
            globalEventBus.emit('taskView:deleteTaskFromArray', this.model.task.taskID);
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

        const taskEl = document.getElementById(this.model.task.taskID);
        globalEventBus.on('cardController:taskRemovedFromOldCard', () => {
            if (taskEl === window.draggedTask) {
                this.model.deleteTask();
                delete this;
            }
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
