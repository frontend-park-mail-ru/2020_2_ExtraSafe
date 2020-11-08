/**
 * Task model
 */
export default class TaskModel {
    /**
     * Task model constructor
     * @param {EventBus} eventBus
     * @param {number} taskNumber
     */
    constructor(eventBus, taskNumber) {
        this.eventBus = eventBus;
        this.task = {
            taskName: '',
            taskID: `task${taskNumber}`,
            taskNameID: `task${taskNumber}Name`,
            contentEditable: 'true',
        };
    }

    updateTaskName(newName) {
        this.task.taskName = newName;
        this.task.contentEditable = 'false';

        this.eventBus.emit('taskModel:taskNameUpdated', this.task);
    }
}
