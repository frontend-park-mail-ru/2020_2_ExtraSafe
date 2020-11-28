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
