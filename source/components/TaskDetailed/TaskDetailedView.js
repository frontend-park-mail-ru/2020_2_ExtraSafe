import BaseView from '../../views/BaseView/BaseView.js';
import './TaskDetailedView.tmpl.js';
import globalEventBus from '../../utils/globalEventBus.js';

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
     */
    addEventListeners() {
        document.getElementById('closeTask').addEventListener('click', () => {
            this.el.style.display = 'none';
            globalEventBus.emit('taskDetailedView:closed', null);
        });
        document.getElementById('saveTaskDescription').addEventListener('click', () => {
            const description = document.getElementById('taskDescription').innerHTML;
            this.eventBus.emit('taskDetailedView:updateTaskDescription', description);
        });
        document.getElementById('taskName').addEventListener('focusout', () => {
            const taskName = document.getElementById('taskName').innerHTML;
            this.eventBus.emit('taskDetailedView:updateTaskName', taskName);
        });
    }

    /**
     * Render task detailed view
     * @param {JSON} json
     */
    render(json) {
        this.el.style.display = 'flex';
        this.el.innerHTML = window.fest['components/TaskDetailed/TaskDetailedView.tmpl'](json);
        this.addEventListeners();
    }
}
