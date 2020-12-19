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
     * @param {Object} board
     * @param {Object} card
     * @param {Object} task
     */
    constructor(el, board, card, task) {
        super(el);
        this.view = new TaskView(el, this.eventBus);
        this.model = new TaskModel(this.eventBus, board, card, task);
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
     */
    updateTaskIDs() {
        this.view.updateTaskHtmlIDs(this.model.task, this.model.task.taskID, this.model.card.cardID);
        this.model.updateTaskIDs();
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
        this.eventBus.on('taskView:openTaskDetailed', () => {
            this.model.getTaskDetailed();
        });
        this.eventBus.on('taskModel:getTaskDetailedSuccess', (responseBody) => {
            console.log(responseBody);
            this.taskDetailed.render(this.model.board, this.model.card, this.model.task);
        });
        this.eventBus.on('taskView:deleteTaskFromArray', () => {
            globalEventBus.emit('taskController:deleteTaskFromArray', this.model.task.taskID);
        });
        this.taskDetailed.eventBus.on('taskDetailedController:taskNameUpdated', () => {
            this.view.updateTaskName(this.model.task.taskName);
        });
        this.taskDetailed.eventBus.on('taskDetailedView:deleteTask', () => {
            this.view.deleteTask(this.model.task);
            this.model.deleteTask();
            globalEventBus.emit('taskController:deleteTaskFromArray', this.model.task.taskID);
        });
        this.taskDetailed.eventBus.on('taskDetailedView:closed', () => {
            // TODO: костыль
            this.taskDetailed.model.task.attachments = [];
            this.taskDetailed.model.task.comments = [];
        });
        this.eventBus.on('taskModel:createTaskFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('taskModel:createTaskSuccess', (responseBody) => {
            console.log(responseBody);
            this.view.updateTaskHtmlIDs(this.model.task, responseBody.taskID, this.model.card.cardID);
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
     * Add event listeners related to web sockets
     */
    addWsEventListeners() {
        this.model.board.ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);

            if (data.body.cardID === this.model.card.cardID && data.body.taskID === this.model.task.taskID) {
                switch (data.method) {
                case 'ChangeTask':
                    this.model.updateTaskByID(data.body.taskID, data.body.taskName, data.body.taskDescription);
                    this.view.updateTaskName(data.body.taskName);
                    break;
                case 'DeleteTask':
                    this.view.deleteTask(this.model.task);
                    globalEventBus.emit('taskController:deleteTaskFromArray', this.model.task.taskID);
                    break;
                default:
                    break;
                }
            }
        });
    }

    /**
     * Add event listeners related to drag and drop
     */
    addDragAndDropEventListeners() {
        this.eventBus.on('taskView:taskOrderChanged', (draggedTask) => {
            globalEventBus.emit('taskController:taskOrderChanged', [this.model.card.cardID, draggedTask]);
        });
        this.eventBus.on('taskView:taskMovedToAnotherCard', ([draggedTask, startTasksDiv]) => {
            globalEventBus.emit('taskController:taskMovedToAnotherCard', [draggedTask, startTasksDiv]);
        });
    }

    /**
     * Add event listeners related to tags
     */
    addTagEventListeners() {
        this.taskDetailed.eventBus.on('taskDetailedController:tagAdded', (tag) => {
            // TODO: убрать костыль
            tag.tagHtmlID = `${this.model.task.taskHtmlID}Tag${tag.tagID}`;
            this.view.addTag(tag);
        });
        this.taskDetailed.eventBus.on('taskDetailedController:tagRemoved', (tag) => {
            // TODO: убрать костыль
            tag.tagHtmlID = `${this.model.task.taskHtmlID}Tag${tag.tagID}`;
            this.view.removeTag(tag);
        });
        globalEventBus.on('taskDetailedController:tagEdit', (tag) => {
            // TODO: убрать костыль
            const tagFound = this.model.task.tags.some((t) => {
                return t.tagID === tag.tagID;
            });
            if (tagFound) {
                const newTag = this.model.changeTag(tag);
                this.view.changeTag(newTag);
            }
        });
    }

    /**
     * Render task
     */
    render() {
        this.addEventListeners();
        this.view.render(this.model.task);
        this.addTagEventListeners();
        this.addWsEventListeners();
    }
}
