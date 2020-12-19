import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';
import taskTemplate from './Task.tmpl.xml';
import tagTemplate from './Tag.tmpl.xml';

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
     * Update task IDs in HTML
     * @param {Object} task
     * @param {number} newTaskID
     * @param {number} newCardID
     */
    updateTaskHtmlIDs(task, newTaskID, newCardID) {
        const taskEl = document.getElementById(task.taskHtmlID);
        const taskNameEl = document.getElementById(task.taskNameID);
        const taskTagsDivEl = document.getElementById(task.tagsDivID);

        taskEl.id = `card${newCardID}Task${newTaskID}`;
        taskNameEl.id = `${taskEl.id}Name`;
        taskTagsDivEl.id = `${taskEl.id}TagsDiv`;
    }

    /**
     * Add all event listeners
     * @param {Object} task
     */
    addEventListeners(task) {
        const taskNameEl = document.getElementById(task.taskNameID);
        taskNameEl.addEventListener('focus', (event) => {
            event.target.addEventListener('keydown', this.onKeyDownBlur);
        });
        taskNameEl.addEventListener('focusout', (event) => {
            event.target.removeEventListener('keydown', this.onKeyDownBlur);
            const newName = taskNameEl.innerText;
            // TODO: сделать проверку на название из пробелов
            if (newName === '') {
                document.getElementById(task.taskHtmlID).remove();
                this.eventBus.emit('taskView:deleteTaskFromArray', null);
            } else {
                this.eventBus.emit('taskView:updateTaskName', newName);
            }
        }, false);
        if (task.contentEditable === 'false') {
            taskNameEl.addEventListener('click', () => {
                this.eventBus.emit('taskView:openTaskDetailed', null);
            }, false);
        }
        this.addDragAndDropEventListeners(task);
    }

    /**
     * Add event listeners related to drag and drop
     * @param {Object} task
     */
    addDragAndDropEventListeners(task) {
        const taskNameEl = document.getElementById(task.taskNameID);
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

        const taskEl = document.getElementById(task.taskHtmlID);
        taskEl.addEventListener('dragstart', (event) => {
            window.draggedTask = event.target;
            window.startTasksDiv = event.target.parentElement;
            window.startTasksDivNextSibling = event.target.nextSibling;
            window.taskDropped = false;
            event.target.style.opacity = '0.001';
        });
        taskEl.addEventListener('dragend', (event) => {
            if (!window.taskDropped) {
                window.startTasksDiv.insertBefore(window.draggedTask, window.startTasksDivNextSibling);
            }
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
                window.taskDropped = true;
                if (window.startTasksDiv === window.draggedTask.parentElement) {
                    this.eventBus.emit('taskView:taskOrderChanged', window.draggedTask);
                } else {
                    this.eventBus.emit('taskView:taskMovedToAnotherCard', [window.draggedTask, window.startTasksDiv]);
                }
            }
        });
    }

    /**
     * Function called on taskNameUpdated event
     * @param {Object} task
     */
    onTaskNameUpdated(task) {
        const taskEl = document.getElementById(task.taskNameID);
        taskEl.contentEditable = 'false';
        taskEl.style.wordBreak = 'break-word';
        taskEl.addEventListener('click', () => {
            this.eventBus.emit('taskView:openTaskDetailed', task);
        }, false);
    }

    /**
     * On key down callback
     * @param {KeyboardEvent} event
     */
    onKeyDownBlur(event) {
        if (event.keyCode === 13 || event.keyCode === 27) {
            event.target.blur();
        }
    }

    /**
     * Update task name view
     * @param {string} name
     */
    updateTaskName(name) {
        document.getElementById(this.task.taskNameID).innerHTML = name;
    }

    /**
     * Update task order in HTML
     * @param {string} taskHtmlID
     * @param {number} taskOrder
     */
    updateTaskOrder(taskHtmlID, taskOrder) {
        document.getElementById(taskHtmlID).dataset.order = taskOrder.toString();
    }

    /**
     * Delete task view
     * @param {Object} task
     */
    deleteTask(task) {
        document.getElementById(task.taskHtmlID).remove();
    }

    /**
     * Render new tag
     * @param {Object} tag
     */
    addTag(tag) {
        const tagsHtml = tagTemplate(tag);
        this.tagsEl.appendChild(rendering.createElementsFromTmpl(tagsHtml));
        // TODO: добавить eventListener на клик, не здесь)
    }

    /**
     * Change tag view
     * @param {Object} tag
     */
    changeTag(tag) {
        document.getElementById(tag.tagHtmlID).style.background = tag.tagColor;
    }

    /**
     * Remove tag view
     * @param {Object} tag
     */
    removeTag(tag) {
        document.getElementById(tag.tagHtmlID).remove();
    }

    /**
     * Render task
     * @param {Object} task
     */
    render(task) {
        this.task = task;
        const html = taskTemplate(task);
        this.el.appendChild(rendering.createElementsFromTmpl(html));
        this.addEventListeners(task);
        if (!task.isInitialized) {
            document.getElementById(task.taskNameID).focus();
        }
        this.tagsEl = document.getElementById(task.tagsDivID);
    }
}
