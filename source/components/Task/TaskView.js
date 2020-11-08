import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';
import './Task.tmpl.js';

/**
 * Class Task view.
 */
export default class TaskView extends BaseView {
    /**
     * TaskView constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * Add all event listeners
     * @param {JSON} taskJSON
     */
    addEventListeners(taskJSON) {
        const taskEl = document.getElementById(taskJSON.taskNameID);
        taskEl.addEventListener('focusout', () => {
            const newName = taskEl.innerHTML;
            this.eventBus.emit('taskView:updateTaskName', newName);
        }, false);
        if (taskJSON.contentEditable === 'false') {
            taskEl.addEventListener('click', () => {
                this.eventBus.emit('taskView:openTaskDetailed', taskJSON);
            }, false);
        }
    }

    /**
     * Function called on taskNameUpdated event
     * @param {JSON} taskJSON
     */
    onTaskNameUpdated(taskJSON) {
        const taskEl = document.getElementById(taskJSON.taskNameID);
        taskEl.contentEditable = 'false';
        taskEl.style.wordBreak = 'break-word';
        taskEl.addEventListener('click', () => {
            this.eventBus.emit('taskView:openTaskDetailed', taskJSON);
        }, false);
    }

    /**
     * Update task name view
     * @param {JSON} taskJSON
     */
    updateTaskName(taskJSON) {
        document.getElementById(taskJSON.taskNameID).innerHTML = taskJSON.taskName;
    }

    /**
     * Delete task view
     * @param {JSON} taskJSON
     */
    deleteTask(taskJSON) {
        document.getElementById(taskJSON.taskID).remove();
    }

    /**
     * Render task
     * @param {JSON} taskJSON
     */
    render(taskJSON) {
        const html = window.fest['components/Task/Task.tmpl'](taskJSON);
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.addEventListeners(taskJSON);
        document.getElementById(taskJSON.taskNameID).focus();
    }
}
