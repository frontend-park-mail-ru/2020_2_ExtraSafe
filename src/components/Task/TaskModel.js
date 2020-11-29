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
            attachments: task.attachments,
            contentEditable: task.contentEditable,
            isInitialized: task.isInitialized,
        };

        this.initTags();
        this.initAttachments();
    }

    /**
     * Initialize tags data
     */
    initTags() {
        if (Array.isArray(this.task.tags) && this.task.tags.length) {
            for (const tag of this.task.tags) {
                tag.tagHtmlID = `${this.task.taskHtmlID}Tag${tag.tagID}`;
                tag.tagDetailedID = `tagDetailed${tag.tagID}`;
                tag.tagDetailedNameID = `tagDetailedName${tag.tagID}`;
                tag.tagBodyHtmlID = `tagBody${tag.tagID}`;
                tag.tagCheckID = `tagCheck${tag.tagID}`;
                tag.tagEditID = `tagEditID${tag.tagID}`;
            }
        }
    }

    /**
     * Initialize attachments data
     */
    initAttachments() {
        if (Array.isArray(this.task.attachments) && this.task.attachments.length) {
            for (const attachment of this.task.attachments) {
                attachment.fileHtmlID = `file${attachment.attachmentID}`;
                attachment.fileNameID = `fileName${attachment.attachmentID}`;
                attachment.fileIconID = `fileIcon${attachment.attachmentID}`;
                attachment.fileRemoveID = `fileRemove${attachment.attachmentID}`;
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
            taskName: this.task.taskName,
            taskDescription: this.task.taskDescription,
            taskOrder: this.task.order,
            taskTags: this.task.tags,
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
            taskName: this.task.taskName,
            taskDescription: this.task.taskDescription,
            taskOrder: this.task.order,
            taskTags: this.task.tags,
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

    /**
     * Update tag in array
     * @param {Object} changedTag
     * @return {Object}
     */
    changeTag(changedTag) {
        const tagIndex = this.task.tags.findIndex((tag) => {
            return tag.tagID === changedTag.tagID;
        });
        this.task.tags[tagIndex].tagColor = changedTag.tagColor;
        this.task.tags[tagIndex].tagName = changedTag.tagName;
        delete this.task.tags[tagIndex].isSelected;
        return this.task.tags[tagIndex];
    }
}
