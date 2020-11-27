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
