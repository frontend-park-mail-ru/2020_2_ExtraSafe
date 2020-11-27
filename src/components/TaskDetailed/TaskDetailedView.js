import BaseView from '../../views/BaseView/BaseView.js';
import taskDetailedViewTemplate from './TaskDetailedView.tmpl.xml';

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
     * @param {Object} task
     */
    addEventListeners(task) {
        document.getElementById('closeTask').addEventListener('click', () => {
            this.el.style.display = 'none';
            this.eventBus.emit('taskDetailedView:closed', null);
        });
        document.getElementById('saveTaskDescription').addEventListener('click', () => {
            const description = document.getElementById('taskDescription').innerText;
            this.eventBus.emit('taskDetailedView:updateTaskDescription', description);
        });
        document.getElementById('taskName').addEventListener('focusout', () => {
            const el = document.getElementById('taskName');
            const taskName = el.innerText;
            // TODO: сделать проверку на название из пробелов
            if (taskName === '') {
                el.innerHTML = task.taskName;
            } else {
                this.eventBus.emit('taskDetailedView:updateTaskName', taskName);
            }
        });
        document.getElementById('deleteTask').addEventListener('click', () => {
            this.el.style.display = 'none';
            this.eventBus.emit('taskDetailedView:deleteTask', null);
        });
        document.getElementById('addTag').addEventListener('click', () => {
            this.eventBus.emit('taskDetailedView:addTag', null);
        });
    }

    /**
     * Render task detailed view
     * @param {Object} task
     */
    render(task) {
        this.el.style.display = 'flex';
        this.el.innerHTML = taskDetailedViewTemplate(task);
        this.addEventListeners(task);
    }
}
