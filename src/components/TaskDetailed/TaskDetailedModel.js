import network from '../../utils/network.js';

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

    // /**
    //  * Get attachments from server
    //  */
    // getAttachments() {
    //     // TODO: запрос в сеть
    //     const attachments = [
    //         {
    //             attachmentID: 0,
    //             fileName: 'cat.png',
    //             fileUrl: 'https://cataas.com/cat',
    //         },
    //         {
    //             attachmentID: 1,
    //             fileName: 'masha.png',
    //             fileUrl: 'https://cataas.com/cat/says/masha_ochen_lenivaya',
    //         },
    //     ];
    //     this.task.attachments = attachments;
    //     this.initAttachments();
    // }
    //
    // /**
    //  * Initialize attachments data
    //  */
    // initAttachments() {
    //     if (Array.isArray(this.task.attachments) && this.task.attachments.length) {
    //         for (const attachment of this.task.attachments) {
    //             attachment.fileHtmlID = `file${attachment.attachmentID}`;
    //             attachment.fileNameID = `fileName${attachment.attachmentID}`;
    //             attachment.fileIconID = `fileIcon${attachment.attachmentID}`;
    //             attachment.fileRemoveID = `fileRemove${attachment.attachmentID}`;
    //         }
    //     }
    // }

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
     * @return {Object}
     */
    createCheckList(checkListName) {
        const checkListID = Math.floor(Math.random() * Math.floor(1000));
        const newCheckList = {
            checkListID: checkListID,
            checkListHtmlID: `checkList${checkListID}`,
            checkListElementsDivID: `checkListElementsDiv${checkListID}`,
            checkListAddNewElementID: `checkListAddNewElement${checkListID}`,
            checkListRemoveID: `checkListRemove${checkListID}`,
            checkListName: checkListName,
            checkListElements: [],
        };
        this.task.checkLists.push(newCheckList);
        return newCheckList;
        // TODO: запрос в сеть
    }

    /**
     * Remove check-list
     * @param {Object} checkListObj
     */
    removeCheckList(checkListObj) {
        // TODO: добавить запрос в сеть
        const removedCheckListIndex = this.task.checkLists.findIndex((checkList) => {
            return checkList.checkListID === checkList.checkListID;
        });
        this.task.checkLists.splice(removedCheckListIndex, 1);
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
        // TODO: запрос в сеть
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
        // TODO: запрос в сеть
    }

    /**
     * Remove check-list element
     * @param {Object} checkListElementObj
     */
    removeCheckListElement(checkListElementObj) {
        // TODO: добавить запрос в сеть
        const checkListFound = this.task.checkLists.find((checkList) => {
            return checkList.checkListID === checkListElementObj.checkListID;
        });
        const elementIndex = checkListFound.checkListElements.findIndex((element) => {
            return element.checkListElementID === checkListElementObj.checkListElementID;
        });
        checkListFound.checkListElements.splice(elementIndex, 1);
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
