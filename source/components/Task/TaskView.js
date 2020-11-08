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

    addEventListeners(taskJSON){
        const taskEl = document.getElementById(taskJSON.taskNameID);
        taskEl.addEventListener('focusout', () => {
            const newName = taskEl.innerHTML;
            this.eventBus.emit('taskView:updateTaskName', newName);
        }, false);
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

    updateTaskName(taskJSON) {
        document.getElementById(taskJSON.taskNameID).innerHTML = taskJSON.taskName;
    }

    render(taskJSON) {
        const html = window.fest['components/Task/Task.tmpl'](taskJSON);
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.addEventListeners(taskJSON);
        document.getElementById(taskJSON.taskNameID).focus();
    }
}
