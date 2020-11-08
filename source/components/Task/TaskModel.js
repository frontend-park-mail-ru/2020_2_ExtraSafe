/**
 * Task model
 */
export default class TaskModel {
    /**
     * Task model constructor
     * @param {EventBus} eventBus
     * @param {number} taskNumber
     * @param {string} cardNumber
     * @param {string} taskID
     * @param {string} taskName
     * @param {string} taskDescription
     * @param {string} contentEditable
     */
    constructor(eventBus, taskNumber, cardNumber, taskID = '', taskName = '',
        taskDescription = '', contentEditable = 'true') {
        this.eventBus = eventBus;
        this.task = {
            taskName: taskName,
            taskDescription: taskDescription,
            taskID: `${cardNumber}Task${taskNumber}`,
            taskNameID: `${cardNumber}Task${taskNumber}Name`,
            contentEditable: contentEditable,
        };
        this.taskJSON = {
            taskID: taskID,
            name: '',
            description: '',
            order: undefined,
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
