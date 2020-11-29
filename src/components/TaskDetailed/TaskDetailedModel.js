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
     * Update tag in board array
     * @param {Object} changedTag
     */
    changeTag(changedTag) {
        const tagBoardIndex = this.board.boardTags.findIndex((tag) => {
            return tag.tagID === changedTag.tagID;
        });
        this.board.boardTags[tagBoardIndex].tagColor = changedTag.tagColor;
        this.board.boardTags[tagBoardIndex].tagName = changedTag.tagName;
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
        // TODO: запрос в сеть, тут еще она это добавляется к задаче короч
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
