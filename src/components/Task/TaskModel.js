import network from '../../utils/network.js';
import userSession from '../../utils/userSession.js';

/**
 * Task model
 */
export default class TaskModel {
    /**
     * Task model constructor
     * @param {EventBus} eventBus
     * @param {Object} board
     * @param {Object} card
     * @param {object} task
     */
    constructor(eventBus, board, card, task) {
        this.eventBus = eventBus;
        this.board = board;
        this.card = card;
        this.task = {
            taskID: task.taskID,
            // taskHtmlID: `card${this.card.cardID}Task${task.taskID}`,
            // taskNameID: `card${this.card.cardID}Task${task.taskID}Name`,
            // tagsDivID: `card${this.card.cardID}Task${task.taskID}TagsDiv`,
            taskHtmlID: `task${task.taskID}`,
            taskNameID: `task${task.taskID}Name`,
            tagsDivID: `task${task.taskID}TagsDiv`,
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            order: task.order,
            tags: task.tags,
            checkLists: task.checkLists,
            attachments: task.attachments,
            comments: [],
            taskAssigners: task.taskAssigners,
            contentEditable: task.contentEditable,
            isInitialized: task.isInitialized,
        };

        this.initTags();
        this.initAttachments();
        this.initCheckLists();
        this.initAssigners();
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
     * Initialize check-lists data
     */
    initCheckLists() {
        if (Array.isArray(this.task.checkLists) && this.task.checkLists.length) {
            for (const checkList of this.task.checkLists) {
                checkList.checkListName = checkList.checklistName;
                checkList.checkListID = checkList.checklistID;
                checkList.checkListHtmlID = `checkList${checkList.checklistID}`;
                checkList.checkListElementsDivID = `checkListElementsDiv${checkList.checklistID}`;
                checkList.checkListAddNewElementID = `checkListAddNewElement${checkList.checklistID}`;
                checkList.checkListRemoveID = `checkListRemove${checkList.checklistID}`;
                checkList.checkListElements = checkList.checklistItems;
                this.initCheckListElements(checkList);
            }
        }
    }

    /**
     * Initialize check-list elements data
     * @param {[Object]} checkList
     */
    initCheckListElements(checkList) {
        if (Array.isArray(checkList.checkListElements) && checkList.checkListElements.length) {
            for (const checkListElement of checkList.checkListElements) {
                // TODO: костыль
                const checkListElementID = Math.floor(Math.random() * Math.floor(10000));
                checkListElement.checkListID = checkList.checkListID;
                checkListElement.checkListElementID = checkListElementID;
                checkListElement.checkListElementHtmlID =
                    `checkList${checkList.checkListID}Element${checkListElementID}`;
                checkListElement.checkListElementCheckID =
                    `checkList${checkList.checkListID}ElementCheck${checkListElementID}`;
                checkListElement.checkListElementNameID =
                    `checkList${checkList.checkListID}ElementName${checkListElementID}`;
                checkListElement.isInitialized = true;
            }
        }
    }

    /**
     * Initialize assigners data
     */
    initAssigners() {
        if (Array.isArray(this.task.taskAssigners) && this.task.taskAssigners.length) {
            for (const assigner of this.task.taskAssigners) {
                assigner.memberHtmlID = `${assigner.username}Member`;
                assigner.memberDeleteID = `${assigner.username}MemberDelete`;
                assigner.memberTaskHtmlID = `${assigner.username}Task`;
                assigner.memberTaskPopupHtmlID = `${assigner.username}TaskPopup`;
                assigner.memberTaskPopupCheckID = `${assigner.username}TaskPopupCheck`;
                assigner.memberAvatarSrc = `${network.serverAddr}/static/avatar/${assigner.avatar}`;
                assigner.memberUsername = assigner.username;
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
     * Update task data by its ID
     * @param {number} taskID
     * @param {string} taskName
     * @param {string} taskDescription
     */
    updateTaskByID(taskID, taskName, taskDescription) {
        this.task.taskName = taskName;
        this.task.taskDescription = taskDescription;
    }

    /**
     * Send request to server with new task
     */
    createTaskForServer() {
        const data = {
            cardID: this.card.cardID,
            taskName: this.task.taskName,
            taskDescription: this.task.taskDescription,
            taskOrder: this.task.order,
            taskTags: this.task.tags,
        };
        network.taskCreate(data, this.board.boardID).then((response) => {
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
            cardID: this.card.cardID,
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
     */
    updateTaskIDs(newTaskID= this.task.taskID) {
        this.task.taskID = newTaskID;
        this.task.taskHtmlID = `card${this.card.cardID}Task${newTaskID}`;
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

    /**
     * Delete tag from array
     * @param {number} tagID
     * @return {Object}
     */
    deleteTagFromArray(tagID) {
        const tagIndex = this.task.tags.findIndex((tag) => {
            return tag.tagID === tagID;
        });
        return this.task.tags.splice(tagIndex, 1)[0];
    }

    /**
     * Delete assigner from array
     * @param {string} username
     * @return {Object}
     */
    deleteAssigner(username) {
        const assignerIndex = this.task.taskAssigners.findIndex((assigner) => {
            return assigner.username === username;
        });
        return this.task.taskAssigners.splice(assignerIndex, 1)[0];
    }

    /**
     * Get task detailed
     */
    getTaskDetailed() {
        network.taskGet(this.task.taskID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.getTaskDetailed();
                    return;
                }
                this.eventBus.emit('taskModel:getTaskDetailedFailed', responseBody.codes);
            } else {
                this.task.taskName = responseBody.taskName;
                this.task.taskDescription = responseBody.taskDescription;
                this.task.attachments = [];
                // TODO: полукостыль
                for (const attachment of responseBody.taskAttachments) {
                    this.task.attachments.push({
                        attachmentID: attachment.attachmentID,
                        fileName: attachment.attachmentFileName,
                        fileUrl: `${network.serverAddr}/static/files/${attachment.attachmentFilePath}`,
                        fileUrlForDelete: attachment.attachmentFilePath,
                        fileHtmlID: `file${attachment.attachmentID}`,
                        fileNameID: `fileName${attachment.attachmentID}`,
                        fileIconID: `fileIcon${attachment.attachmentID}`,
                        fileRemoveID: `fileRemove${attachment.attachmentID}`,
                    });
                }
                this.task.comments = [];
                for (const comment of responseBody.taskComments) {
                    this.task.comments.push({
                        commentID: comment.commentID,
                        commentHtmlID: `comment${comment.commentID}`,
                        commentAvatar: `${network.serverAddr}/static/avatar/${comment.commentAuthor.avatar}`,
                        commentUsername: comment.commentAuthor.username,
                        commentRemove: `comment${comment.commentID}Remove`,
                        commentText: comment.commentMessage,
                        isMine: userSession.data.username === comment.commentAuthor.username,
                    });
                }
                this.eventBus.emit('taskModel:getTaskDetailedSuccess', responseBody);
            }
            return responseBody;
        });
    }
}
