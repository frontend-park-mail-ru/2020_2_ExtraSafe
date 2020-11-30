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
        this.task.tags.push(tag);
        // TODO: запрос в сеть
    }

    /**
     * Update tag in array
     * @param {Object} changedTag
     */
    changeTag(changedTag) {
        delete changedTag.isSelected;
        const tagIndex = this.task.tags.findIndex((tag) => {
            return tag.tagID === changedTag.tagID;
        });
        this.task.tags[tagIndex] = changedTag;

        // TODO: опять костыль
        const tagBoardIndex = this.board.boardTags.findIndex((tag) => {
            return tag.tagID === changedTag.tagID;
        });
        this.board.boardTags[tagBoardIndex] = changedTag;
        // TODO: запрос в сеть
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
        // TODO: запрос в сеть
    }

    /**
     * Create new tag
     * @param {string} tagName
     * @param {string} tagColor
     * @return {Object}
     */
    createTag(tagName, tagColor) {
        const tagID = Math.floor(Math.random() * Math.floor(1000));
        const newTag = {
            tagID: tagID,
            tagDetailedID: `tagDetailed${tagID}`,
            tagDetailedNameID: `tagDetailedName${tagID}`,
            tagBodyHtmlID: `tagBody${tagID}`,
            tagCheckID: `tagCheck${tagID}`,
            tagEditID: `tagEditID${tagID}`,
            tagColor: tagColor,
            tagName: tagName,
        };
        this.task.tags.push(newTag);
        this.board.boardTags.push(newTag);
        return newTag;
        // TODO: запрос в сеть
    }

    /**
     * Upload file
     * @param {File} file
     */
    uploadFile(file) {
        // TODO: добавить запрос в сеть
        const attachmentID = Math.floor(Math.random() * Math.floor(1000));
        const fileUrl = 'https://cataas.com/cat';
        const newAttachment = {
            attachmentID: attachmentID,
            fileName: file.name,
            fileUrl: fileUrl,
            fileHtmlID: `file${attachmentID}`,
            fileNameID: `fileName${attachmentID}`,
            fileIconID: `fileIcon${attachmentID}`,
            fileRemoveID: `fileRemove${attachmentID}`,
        };
        this.task.attachments.push(newAttachment);
        this.eventBus.emit('taskDetailedModel:uploadFileSuccess', newAttachment);
    }

    /**
     * Get attachments from server
     */
    getAttachments() {
        // TODO: запрос в сеть
        const attachments = [
            {
                attachmentID: 0,
                fileName: 'cat.png',
                fileUrl: 'https://cataas.com/cat',
            },
            {
                attachmentID: 1,
                fileName: 'masha.png',
                fileUrl: 'https://cataas.com/cat/says/masha_ochen_lenivaya',
            },
        ];
        this.task.attachments = attachments;
        this.initAttachments();
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
     * Remove attachment
     * @param {Object} fileObj
     */
    removeAttachment(fileObj) {
        // TODO: добавить запрос в сеть
        const removedFileIndex = this.task.attachments.findIndex((attachment) => {
            return attachment.attachmentID === fileObj.attachmentID;
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
