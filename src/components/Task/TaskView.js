import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';
import taskTemplate from './Task.tmpl.xml';
import globalEventBus from '../../utils/globalEventBus.js';

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
        const taskNameEl = document.getElementById(taskJSON.taskNameID);
        taskNameEl.addEventListener('focusout', () => {
            const newName = taskNameEl.innerHTML;
            // TODO: сделать проверку на название из пробелов
            if (newName === '') {
                // TODO: добавить удаление объекта
                document.getElementById(taskJSON.taskID).remove();
            } else {
                this.eventBus.emit('taskView:updateTaskName', newName);
            }
        }, false);
        taskNameEl.addEventListener('dragover', (event) => {
            event.stopPropagation();
            event.preventDefault();
            event.target.parentElement.dispatchEvent(new DragEvent('dragover'));
        });
        taskNameEl.addEventListener('dragenter', (event) => {
            event.stopPropagation();
            event.target.parentElement.dispatchEvent(new DragEvent('dragenter'));
        });
        taskNameEl.addEventListener('dragleave', (event) => {
            event.stopPropagation();
            event.target.parentElement.dispatchEvent(new DragEvent('dragleave'));
        });
        if (taskJSON.contentEditable === 'false') {
            taskNameEl.addEventListener('click', () => {
                this.eventBus.emit('taskView:openTaskDetailed', taskJSON);
            }, false);
        }

        const taskEl = document.getElementById(taskJSON.taskID);
        taskEl.addEventListener('dragstart', (event) => {
            window.draggedTask = event.target;
            window.startTasksDiv = event.target.parentElement;
            event.target.style.opacity = '0.001';
        });
        taskEl.addEventListener('dragend', (event) => {
            window.draggedTask = null;
            event.target.style = '';
        });
        taskEl.addEventListener('dragenter', (event) => {
            if (event.target !== window.draggedTask) {
                event.target.parentElement.insertBefore(window.draggedTask, event.target);
            }
        });
        taskEl.addEventListener('drop', (event) => {
            if (event.target !== window.draggedTask) {
                console.log('drop');
                window.endTasksDiv = window.draggedTask.parentElement;
                globalEventBus.emit('taskView:taskPositionChanged', null);
            }
        });
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
        const html = taskTemplate(taskJSON);
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.addEventListeners(taskJSON);
        if (!taskJSON.isInitialized) {
            document.getElementById(taskJSON.taskNameID).focus();
        }
    }
}
