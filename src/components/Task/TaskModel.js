import network from '../../utils/network.js';

/**
 * Task model
 */
export default class TaskModel {
    /**
     * Task model constructor
     * @param {EventBus} eventBus
     * @param {object} task
     */
    constructor(eventBus, task) {
        this.eventBus = eventBus;
        this.task = {
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            taskID: `card${task.cardID}Task${task.taskID}`,
            taskNameID: `card${task.cardID}Task${task.taskID}Name`,
            contentEditable: task.contentEditable,
            isInitialized: task.isInitialized,
            order: task.order,
        };
        this.taskJSON = {
            boardID: task.boardID,
            cardID: task.cardID,
            taskID: task.taskID,
            name: task.taskName,
            description: task.taskDescription,
            order: task.order,
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
        network.taskDelete(this.taskJSON.taskID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.deleteTask();
                    return;
                }
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * send request to server with new task
     */
    createTaskForServer() {
        const data = {
            cardID: this.taskJSON.cardID,
            name: this.task.taskName,
            description: this.task.taskDescription,
            order: this.task.order,
        };
        network.taskCreate(data, this.taskJSON.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.createTaskForServer();
                    return;
                }
                this.eventBus.emit('taskModel:createTaskFailed', responseBody.codes);
            } else {
                this.updateTaskIDs(responseBody);
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
            taskID: this.taskJSON.taskID,
            cardID: this.taskJSON.cardID,
            name: this.task.taskName,
            description: this.task.taskDescription,
            order: this.task.order,
        };
        network.taskSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.updateTaskForServer();
                    return;
                }
                this.eventBus.emit('taskModel:setTaskFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskModel:setTaskSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Update task IDs
     * @param {JSON} taskIDJson
     */
    updateTaskIDs(taskIDJson) {
        const taskEl = document.getElementById(this.task.taskID);
        const taskNameEl = document.getElementById(this.task.taskNameID);

        this.taskJSON.taskID = taskIDJson.taskID;
        this.task.taskID = `card${this.taskJSON.cardID}Task${taskIDJson.taskID}`;
        this.task.taskNameID = `card${this.taskJSON.cardID}Task${taskIDJson.taskID}Name`;

        taskEl.id = this.task.taskID;
        taskNameEl.id = this.task.taskNameID;
    }
}
