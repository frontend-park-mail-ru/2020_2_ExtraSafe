import BaseView from '../../views/BaseView/BaseView.js';
import './TaskDetailedView.tmpl.js';

/**
 * Task detailed view
 */
export default class TaskDetailedView extends BaseView {
    /**
     * Task detailed view constructor
     * @param {HTMLElement} el
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * add all event listeners
     * @param {JSON} json
     */
    addEventListeners(json) {
        document.getElementById('closeTask').addEventListener('click', () => {
            this.el.style.display = 'none';
            this.eventBus.emit('taskDetailedView:closed', null);
        });
        document.getElementById('saveTaskDescription').addEventListener('click', () => {
            const description = document.getElementById('taskDescription').innerHTML;
            this.eventBus.emit('taskDetailedView:updateTaskDescription', description);
        });
        document.getElementById('taskName').addEventListener('focusout', () => {
            const el = document.getElementById('taskName');
            const taskName = el.innerHTML;
            // TODO: сделать проверку на название из пробелов
            if (taskName === '') {
                el.innerHTML = json.taskName;
            } else {
                this.eventBus.emit('taskDetailedView:updateTaskName', taskName);
            }
        });
        document.getElementById('deleteTask').addEventListener('click', () => {
            this.el.style.display = 'none';
            this.eventBus.emit('taskDetailedView:deleteTask', null);
        });
    }

    /**
     * Render task detailed view
     * @param {JSON} json
     */
    render(json) {
        this.el.style.display = 'flex';
        this.el.innerHTML = window.fest['components/TaskDetailed/TaskDetailedView.tmpl'](json);
        this.addEventListeners(json);
    }
}
