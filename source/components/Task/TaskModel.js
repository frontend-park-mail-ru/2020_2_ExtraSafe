/**
 * Task model
 */
export default class TaskModel {
    /**
     * Task model constructor
     * @param {EventBus} eventBus
     * @param {number} taskNumber
     * @param {string} cardNumber
     */
    constructor(eventBus, taskNumber, cardNumber) {
        this.eventBus = eventBus;
        this.task = {
            taskName: '',
            taskID: `${cardNumber}Task${taskNumber}`,
            taskNameID: `${cardNumber}Task${taskNumber}Name`,
            contentEditable: 'true',
        };
    }

    /**
     * Update task name data
     * @param {string} newName
     */
    updateTaskName(newName) {
        this.task.taskName = newName;
        this.task.contentEditable = 'false';

        this.eventBus.emit('taskModel:taskNameUpdated', this.task);
    }
}
