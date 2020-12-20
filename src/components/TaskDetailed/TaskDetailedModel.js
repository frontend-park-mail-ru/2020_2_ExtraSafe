import network from '../../utils/network.js';
import userSession from '../../utils/userSession.js';

/**
 * Task detailed model
 */
export default class TaskDetailedModel {
    /**
     * Task detailed model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    /**
     * Add tag to array
     * @param {Object} tag
     */
    addTag(tag) {
        const tagForServer = {
            taskID: this.task.taskID,
            tagID: tag.tagID,
        };

        network.tagAddToTask(tagForServer).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.addTag(tag);
                    return;
                }
            }
        }).catch((error) => {
            return;
        });

        this.task.tags.push(tag);
        // TODO: запрос в сеть +
    }

    /**
     * Update tag in board array
     * @param {Object} changedTag
     */
    changeTag(changedTag) {
        const tagBoardIndex = this.board.boardTags.findIndex((tag) => {
            return tag.tagID === changedTag.tagID;
        });

        const tagForServer = {
            boardID: this.board.boardID,
            tagID: changedTag.tagID,
            tagName: changedTag.tagName,
            tagColor: changedTag.tagColor,
        };

        network.tagSet(tagForServer).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.changeTag(changedTag);
                    return;
                }
            }
        }).catch((error) => {
            return;
        });
        this.board.boardTags[tagBoardIndex].tagColor = changedTag.tagColor;
        this.board.boardTags[tagBoardIndex].tagName = changedTag.tagName;
        // TODO: запрос в сеть +
    }

    /**
     * Remove tag from array
     * @param {Object} removedTag
     */
    removeTag(removedTag) {
        const tagIndex = this.task.tags.findIndex((tag) => {
            return tag.tagID === removedTag.tagID;
        });
        this.task.tags.splice(tagIndex, 1);

        const tagForServer = {
            taskID: this.task.taskID,
            tagID: removedTag.tagID,
        };

        network.tagRemoveFromTask(tagForServer).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.removeTag(removedTag);
                    return;
                }
            }
        }).catch((error) => {
            return;
        });
        // TODO: запрос в сеть +
    }

    /**
     * Create new tag on server
     * @param {string} tagName
     * @param {string} tagColor
     */
    createTag(tagName, tagColor) {
        const newTagForServer = {
            boardID: this.board.boardID,
            tagColor: tagColor,
            tagName: tagName,
        };

        network.tagCreate(newTagForServer).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.removeTag(removedTag);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:createTagFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskDetailedModel:createTagSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });
        // TODO: запрос в сеть, тут еще она это добавляется к задаче короч +-
    }

    /**
     * Create new tag
     * @param {Object} responseBody
     * @return {Object}
     */
    addCreatedTag(responseBody) {
        const newTag = {
            tagID: responseBody.tagID,
            tagDetailedID: `tagDetailed${responseBody.tagID}`,
            tagDetailedNameID: `tagDetailedName${responseBody.tagID}`,
            tagBodyHtmlID: `tagBody${responseBody.tagID}`,
            tagCheckID: `tagCheck${responseBody.tagID}`,
            tagEditID: `tagEditID${responseBody.tagID}`,
            tagColor: responseBody.tagColor,
            tagName: responseBody.tagName,
        };
        // this.task.tags.push(newTag);
        this.board.boardTags.push(newTag);
        this.addTag(newTag);
        return newTag;
    }

    /**
     * Upload file on server
     * @param {File} file
     */
    uploadFileOnServer(file) {
        const formData = new FormData();
        formData.append('attachmentFileName', file.name);
        formData.append('taskID', this.task.taskID);
        formData.append('file', file);

        network.attachmentCreate(formData).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.uploadFileOnServer(file);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:uploadFileOnServerFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskDetailedModel:uploadFileOnServerSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Add file
     * @param {Object} responseBody
     * @return {Object}
     */
    addFile(responseBody) {
        const newAttachment = {
            attachmentID: responseBody.attachmentID,
            fileName: responseBody.attachmentFileName,
            fileUrl: `${network.serverAddr}/files/${responseBody.attachmentFilePath}`,
            fileUrlForDelete: responseBody.attachmentFilePath,
            fileHtmlID: `file${responseBody.attachmentID}`,
            fileNameID: `fileName${responseBody.attachmentID}`,
            fileIconID: `fileIcon${responseBody.attachmentID}`,
            fileRemoveID: `fileRemove${responseBody.attachmentID}`,
        };
        this.task.attachments.push(newAttachment);
        return newAttachment;
    }

    /**
     * Remove attachment
     * @param {Object} fileObj
     */
    removeAttachment(fileObj) {
        const removedFileIndex = this.task.attachments.findIndex((attachment) => {
            return attachment.attachmentID === fileObj.attachmentID;
        });
        const data = {
            taskID: this.task.taskID,
            attachmentID: fileObj.attachmentID,
            attachmentFileName: fileObj.fileUrlForDelete,
        };
        network.attachmentDelete(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.removeAttachment(fileObj);
                    return;
                }
            }
        }).catch((error) => {
            return;
        });
        this.task.attachments.splice(removedFileIndex, 1);
    }

    /**
     * Create new check-list
     * @param {string} checkListName
     */
    createCheckList(checkListName) {
        const data = {
            taskID: this.task.taskID,
            checklistName: checkListName,
            checklistItems: [],
        };

        network.checklistCreate(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.createCheckList(checkListName);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:createCheckListFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskDetailedModel:createCheckListSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Add check-list
     * @param {Object} responseBody
     * @return {Object}
     */
    addCheckList(responseBody) {
        const newCheckList = {
            checkListID: responseBody.checklistID,
            checkListHtmlID: `checkList${responseBody.checklistID}`,
            checkListElementsDivID: `checkListElementsDiv${responseBody.checklistID}`,
            checkListAddNewElementID: `checkListAddNewElement${responseBody.checklistID}`,
            checkListRemoveID: `checkListRemove${responseBody.checklistID}`,
            checkListName: responseBody.checklistName,
            checkListElements: [],
        };
        this.task.checkLists.push(newCheckList);
        return newCheckList;
    }

    /**
     * Remove check-list
     * @param {Object} checkListObj
     */
    removeCheckList(checkListObj) {
        const data = {
            taskID: this.task.taskID,
            checklistID: checkListObj.checkListID,
        };

        network.checklistDelete(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.removeCheckList(checkListObj);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:removeCheckListFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskDetailedModel:removeCheckListSuccess', responseBody);
                this.deleteCheckListByID(checkListObj.checkListID);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Delete comment by ID from array
     * @param {number} checkListID
     * @return {Object}
     */
    deleteCheckListByID(checkListID) {
        const index = this.task.checkLists.findIndex((checkList) => {
            return checkList.checkListID === checkListID;
        });

        return this.task.checkLists.splice(index, 1)[0];
    }

    /**
     * Update check-list
     * @param {Object} checkListObj
     */
    updateCheckList(checkListObj) {
        const data = {
            taskID: this.task.taskID,
            checklistID: checkListObj.checkListID,
            checklistName: checkListObj.checkListName,
            checklistItems: [],
        };

        for (const checkListElement of checkListObj.checkListElements) {
            data.checklistItems.push({
                checkListElementName: checkListElement.checkListElementName,
                isChecked: checkListElement.isChecked,
            });
        }

        network.checklistSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(checkListObj)) {
                    this.updateCheckList(data);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:updateCheckListFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskDetailedModel:updateCheckListSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Create new check-list element
     * @param {Object} checkListElement
     * @param {string} checkListElementName
     */
    createCheckListElement(checkListElement, checkListElementName) {
        const checkListFound = this.task.checkLists.find((checkList) => {
            return checkList.checkListID === checkListElement.checkListID;
        });
        checkListElement.checkListElementName = checkListElementName;
        checkListElement.isInitialized = true;
        checkListElement.isChecked = false;
        checkListFound.checkListElements.push(checkListElement);

        this.updateCheckList(checkListFound);
    }

    /**
     * Update check-list element
     * @param {Object} checkListElement
     * @param {string} checkListElementName
     * @param {boolean} isChecked
     */
    updateCheckListElement(checkListElement, checkListElementName = checkListElement.checkListElementName,
        isChecked = checkListElement.isChecked) {
        checkListElement.checkListElementName = checkListElementName;
        checkListElement.isChecked = isChecked;

        const checkListFound = this.task.checkLists.find((checkList) => {
            return checkList.checkListID === checkListElement.checkListID;
        });
        this.updateCheckList(checkListFound);
    }

    /**
     * Remove check-list element
     * @param {Object} checkListElementObj
     */
    removeCheckListElement(checkListElementObj) {
        const checkListFound = this.task.checkLists.find((checkList) => {
            return checkList.checkListID === checkListElementObj.checkListID;
        });
        const elementIndex = checkListFound.checkListElements.findIndex((element) => {
            return element.checkListElementID === checkListElementObj.checkListElementID;
        });
        checkListFound.checkListElements.splice(elementIndex, 1);

        this.updateCheckList(checkListFound);
    }

    /**
     * Add assigner
     * @param {Object} user
     */
    addAssigner(user) {
        const data = {
            taskID: this.task.taskID,
            assignerUsername: user.memberUsername,
        };

        network.userAddToTask(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(checkListObj)) {
                    this.addAssigner(user);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:addAssignerFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskDetailedModel:addAssignerSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });

        this.task.taskAssigners.push(user);
    }

    /**
     * Remove assigner
     * @param {Object} user
     */
    removeAssigner(user) {
        const data = {
            taskID: this.task.taskID,
            assignerUsername: user.memberUsername,
        };

        network.userRemoveFromTask(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(checkListObj)) {
                    this.removeAssigner(user);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:removeAssignerFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskDetailedModel:removeAssignerSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });

        const index = this.task.taskAssigners.findIndex((assigner) => {
            return assigner.memberName === user.memberName;
        });
        this.task.taskAssigners.splice(index, 1);
    }

    /**
     * Create comment
     * @param {string} commentText
     */
    createComment(commentText) {
        const data = {
            taskID: this.task.taskID,
            commentMessage: commentText,
        };

        network.commentCreate(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(checkListObj)) {
                    this.createComment(commentText);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:createCommentFailed', responseBody.codes);
            } else {
                this.task.comments.push();
                this.eventBus.emit('taskDetailedModel:createCommentSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Add comment
     * @param {Object} responseBody
     * @return {Object}
     */
    addComment(responseBody) {
        const newComment = {
            commentID: responseBody.commentID,
            commentHtmlID: `comment${responseBody.commentID}`,
            commentAvatar: `${network.serverAddr}/avatar/${responseBody.commentAuthor.avatar}`,
            commentUsername: responseBody.commentAuthor.username,
            commentRemove: `comment${responseBody.commentID}Remove`,
            commentText: responseBody.commentMessage,
            isMine: userSession.data.username === responseBody.commentAuthor.username,
        };
        this.task.comments.push(newComment);
        return newComment;
    }

    /**
     * Create comment
     * @param {Object} comment
     */
    removeComment(comment) {
        const data = {
            taskID: this.task.taskID,
            commentID: comment.commentID,
        };

        network.commentDelete(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(checkListObj)) {
                    this.removeComment(comment);
                    return;
                }
                this.eventBus.emit('taskDetailedModel:removeCommentFailed', responseBody.codes);
            } else {
                this.eventBus.emit('taskDetailedModel:removeCommentSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Delete comment by ID from array
     * @param {number} commentID
     * @return {Object}
     */
    deleteCommentByID(commentID) {
        const index = this.task.comments.findIndex((comment) => {
            return comment.commentID === commentID;
        });

        return this.task.comments.splice(index, 1)[0];
    }

    /**
     * Update task description
     * @param {string} newDescription
     */
    updateTaskDescription(newDescription) {
        this.task.taskDescription = newDescription;
    }

    /**
     * Update task name
     * @param {string} newTaskName
     */
    updateTaskName(newTaskName) {
        this.task.taskName = newTaskName;
    }
}
