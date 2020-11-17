import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';
import cardTemplate from './Card.tmpl.xml';
import globalEventBus from '../../utils/globalEventBus.js';

/**
 * Class Card view.
 */
export default class CardView extends BaseView {
    /**
     * CardView constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * Add all event listeners
     * @param {JSON} cardJSON
     */
    addEventListeners(cardJSON) {
        document.getElementById(cardJSON.cardNameID).addEventListener('focusout', (event) => {
            const newName = event.target.innerText;
            // TODO: сделать проверку на название из пробелов
            if (newName === '') {
                if (cardJSON.isInitialized) {
                    event.target.innerHTML = cardJSON.cardName;
                } else {
                    document.getElementById(cardJSON.cardID).remove();
                    globalEventBus.emit('cardView:deleteCardFromArray', cardJSON.cardID);
                }
            } else {
                this.eventBus.emit('cardView:updateCardName', newName);
            }
        });
        document.getElementById(cardJSON.addTaskID).addEventListener('click', () => {
            this.eventBus.emit('cardView:addNewTask', this.tasksDiv);
        });
        document.getElementById(cardJSON.addTaskID).addEventListener('dragenter', () => {
            this.tasksDiv.appendChild(window.draggedTask);
        });
        document.getElementById(cardJSON.addTaskID).addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        document.getElementById(cardJSON.addTaskID).addEventListener('drop', () => {
            window.taskDropped = true;
            globalEventBus.emit('taskView:taskPositionChanged', null);
        });
        document.getElementById(cardJSON.cardSettingsID).addEventListener('click', () => {
            document.getElementById(cardJSON.cardID).remove();
            this.eventBus.emit('cardView:deleteCard', null);
        });
    }

    /**
     * Render task
     * @param {TaskController} task
     */
    renderTask(task) {
        task.render();
    }

    /**
     * Render card
     * @param {JSON} cardJSON
     */
    render(cardJSON) {
        const html = cardTemplate(cardJSON);
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.tasksDiv = document.getElementById(cardJSON.tasksDiv);
        this.addEventListeners(cardJSON);
        this.eventBus.emit('cardView:addTasksFromServer', this.tasksDiv);
        if (!cardJSON.isInitialized) {
            document.getElementById(cardJSON.cardNameID).focus();
        }
    }
}
