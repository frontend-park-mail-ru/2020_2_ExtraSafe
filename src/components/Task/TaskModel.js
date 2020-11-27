import network from '../../utils/network.js';

/**
 * Task model
 */
export default class TaskModel {
    /**
     * Task model constructor
     * @param {EventBus} eventBus
     * @param {Object} board
     * @param {object} task
     */
    constructor(eventBus, board, task) {
        this.eventBus = eventBus;
        // TODO: переделеать под board и card
        this.board = board;
        this.task = {
            boardID: task.boardID,
            cardID: task.cardID,
            taskID: task.taskID,
            taskHtmlID: `card${task.cardID}Task${task.taskID}`,
            taskNameID: `card${task.cardID}Task${task.taskID}Name`,
            tagsDivID: `card${task.cardID}Task${task.taskID}TagsDiv`,
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            order: task.order,
            tags: task.tags,
            contentEditable: task.contentEditable,
            isInitialized: task.isInitialized,
        };

        this.initTags();
    }

    /**
     * Initialize tags data
     */
    initTags() {
        if (Array.isArray(this.task.tags) && this.task.tags.length) {
            for (const tag of this.task.tags) {
                tag.tagHtmlID = `${this.task.taskHtmlID}Tag${tag.tagID}`;
                tag.tagDetailedID = `tagDetailed${tag.tagID}`;
                tag.tagBodyHtmlID = `tagBody${tag.tagID}`;
                tag.tagCheckID = `tagCheck${tag.tagID}`;
                tag.tagEditID = `tagEditID${tag.tagID}`;
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
     * Delete task on server
     */
    deleteTask() {
        network.taskDelete(this.task.taskID).then((response) => {
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
     * Send request to server with new task
     */
    createTaskForServer() {
        const data = {
            cardID: this.task.cardID,
            name: this.task.taskName,
            description: this.task.taskDescription,
            order: this.task.order,
            tags: this.task.tags,
        };
        network.taskCreate(data, this.task.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.createTaskForServer();
                    return;
                }
                this.eventBus.emit('taskModel:createTaskFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskModel:createTaskSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Send request to server with update task
     */
    updateTaskForServer() {
        const data = {
            taskID: this.task.taskID,
            cardID: this.task.cardID,
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
     * @param {number} newTaskID
     * @param {number} newCardID
     */
    updateTaskIDs(newTaskID= this.task.taskID, newCardID = this.task.cardID) {
        this.task.cardID = newCardID;
        this.task.taskID = newTaskID;
        this.task.taskHtmlID = `card${this.task.cardID}Task${newTaskID}`;
        this.task.taskNameID = `${this.task.taskHtmlID}Name`;
        this.task.tagsDivID = `${this.task.taskHtmlID}TagsDiv`;
    }

    // /**
    //  * Add tag data
    //  * @param {string} name
    //  * @param {string} color
    //  * @param {number} tagID
    //  */
    // addTag(name, color, tagID) {
    //     const newTag = {
    //         tagID: tagID,
    //         tagHtmlID: `${this.task.taskHtmlID}Tag${tagID}`,
    //         tagName: name,
    //         tagColor: color,
    //     };
    //     this.task.tags.push(newTag);
    //     this.eventBus.emit('taskModel:tagDataAdded', newTag);
    // }

    // /**
    //  * Add tag data
    //  * @param {Object} tag
    //  */
    // addTag(tag) {
    //     this.task.tags.push(tag);
    //     // this.eventBus.emit('taskModel:tagDataAdded', newTag);
    // }
    //
    // /**
    //  * Remove tag from array
    //  * @param {Object} removedTag
    //  */
    // removeTag(removedTag) {
    //     const tagIndex = this.task.tags.findIndex((tag) => {
    //         return tag.tagID === removedTag.tagID;
    //     });
    //     this.task.tags.splice(tagIndex, 1);
    // }
}
