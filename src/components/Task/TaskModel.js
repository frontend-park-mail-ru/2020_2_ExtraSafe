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
            tagsDivID: `card${task.cardID}Task${task.taskID}TagsDiv`,
            contentEditable: task.contentEditable,
            isInitialized: task.isInitialized,
            order: task.order,
            tags: task.tags,
        };
        this.taskJSON = {
            boardID: task.boardID,
            cardID: task.cardID,
            taskID: task.taskID,
            name: task.taskName,
            description: task.taskDescription,
            order: task.order,
        };

        if (Array.isArray(this.task.tags) && this.task.tags.length) {
            for (const tag of this.task.tags) {
                tag.tagHtmlID = `${this.task.taskID}Tag${tag.tagID.toString()}`;
            }
        }
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
            tags: this.task.tags,
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
            tags: this.task.tags,
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
        const taskTagsDivEl = document.getElementById(this.task.tagsDivID);

        this.taskJSON.taskID = taskIDJson.taskID;
        this.task.taskID = `card${this.taskJSON.cardID}Task${taskIDJson.taskID}`;
        this.task.taskNameID = `${this.task.taskID}Name`;
        this.task.tagsDivID = `${this.task.taskID}TagsDiv`;

        taskEl.id = this.task.taskID;
        taskNameEl.id = this.task.taskNameID;
        taskTagsDivEl.id = this.task.tagsDivID;
    }

    /**
     * Add tag data
     * @param {string} name
     * @param {string} color
     * @param {number} tagID
     */
    addTag(name, color, tagID) {
        const newTag = {
            tagHtmlID: `${this.task.taskID}Tag${tagID.toString()}`,
            tagID: tagID,
            tagName: name,
            tagColor: color,
        };
        this.task.tags.push(newTag);
        this.eventBus.emit('taskModel:tagDataAdded', newTag);
    }
}
