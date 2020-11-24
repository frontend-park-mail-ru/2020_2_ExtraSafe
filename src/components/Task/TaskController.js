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
     * Update task order
     * @param {number} taskOrder
     */
    updateTaskOrder(taskOrder) {
        this.model.task.order = taskOrder;
        this.view.updateTaskOrder(this.model.task.taskHtmlID, taskOrder);
    }

    /**
     * Update task IDs
     * @param {number} newTaskID
     * @param {number} newCardID
     */
    updateTaskIDs(newTaskID= this.model.task.taskID, newCardID= this.model.task.cardID) {
        this.view.updateTaskHtmlIDs(this.model.task, newTaskID, newCardID);
        this.model.updateTaskIDs(newTaskID, newCardID);
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
        this.eventBus.on('taskView:deleteTaskFromArray', () => {
            globalEventBus.emit('taskController:deleteTaskFromArray', this.model.task.taskID);
        });
        this.taskDetailed.eventBus.on('taskDetailedController:taskNameUpdated', () => {
            this.view.updateTaskName(this.model.task);
        });
        this.taskDetailed.eventBus.on('taskDetailedView:deleteTask', () => {
            this.view.deleteTask(this.model.task);
            this.model.deleteTask();
            globalEventBus.emit('taskController:deleteTaskFromArray', this.model.task.taskID);
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
        this.eventBus.on('taskModel:createTaskSuccess', (responseBody) => {
            console.log(responseBody);
            this.view.updateTaskHtmlIDs(this.model.task, responseBody.taskID);
            this.model.updateTaskIDs(responseBody.taskID);
        });
        this.eventBus.on('taskModel:setTaskFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('taskModel:setTaskSuccess', (data) => {
            console.log(data);
        });
        this.eventBus.on('taskModel:tagDataAdded', (newTag) => {
            this.view.addTag(newTag);
        });

        this.addDragAndDropEventListeners();
    }

    /**
     * Add event listeners related to drag and drop
     */
    addDragAndDropEventListeners() {
        this.eventBus.on('taskView:taskOrderChanged', (draggedTask) => {
            globalEventBus.emit('taskController:taskOrderChanged', [this.model.task.cardID, draggedTask]);
        });
        this.eventBus.on('taskView:taskMovedToAnotherCard', ([draggedTask, startTasksDiv]) => {
            globalEventBus.emit('taskController:taskMovedToAnotherCard', [draggedTask, startTasksDiv]);
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
