import network from '../../utils/network.js';

/**
 * Task model
 */
export default class TaskModel {
    /**
     * Task model constructor
     * @param {EventBus} eventBus
     * @param {number} taskNumber
     * @param {string} cardNumber
     * @param {object} task
     */
    constructor(eventBus, taskNumber, cardNumber, task) {
        this.eventBus = eventBus;
        this.task = {
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            taskID: `${cardNumber}Task${taskNumber}`,
            taskNameID: `${cardNumber}Task${taskNumber}Name`,
            contentEditable: task.contentEditable,
            isInitialized: task.isInitialized,
        };
        this.taskJSON = {
            boardID: task.boardID,
            cardID: task.cardID,
            taskID: task.taskID,
            name: task.taskName,
            description: task.taskDescription,
            order: undefined,
        };
    }

    /**
     * Update task name data
     * @param {string} newName
     */
    updateTaskName(newName) {
        this.task.taskName = newName;
        this.task.contentEditable = 'false';
        this.task.isInitialized = true;

        this.eventBus.emit('taskModel:taskNameUpdated', this.task);
    }

    /**
     * delete task on server
     */
    deleteTask() {
        network.taskDelete(this.taskJSON.taskID);
    }

    /**
     * send request to server with new task
     */
    createTaskForServer() {
        const data = {
            taskID: 0,
            cardID: this.taskJSON.cardID,
            name: this.task.taskName,
            description: this.task.taskDescription,
        };
        network.taskCreate(data, this.taskJSON.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('taskModel:createTaskFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskModel:createTaskSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * send request to server with update task
     */
    updateTaskForServer() {
        const data = {
            taskID: 0,
            cardID: this.taskJSON.cardID,
            name: this.task.taskName,
            description: this.task.taskDescription,
        };
        network.taskSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('taskModel:setTaskFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskModel:setTaskSuccess', responseBody);
            }
            return responseBody;
        });
    }
}
