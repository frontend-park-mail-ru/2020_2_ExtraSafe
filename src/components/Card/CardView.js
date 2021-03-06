import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';
import cardTemplate from './Card.tmpl.xml';

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
     * Update card IDs in HTML
     * @param {Object} card
     * @param {number} newCardID
     */
    updateCardHtmlIDs(card, newCardID) {
        const cardEl = document.getElementById(card.cardHtmlID);
        const cardNameIDEl = document.getElementById(card.cardNameID);
        const cardSettingsIDEl = document.getElementById(card.cardSettingsID);
        const addTaskIDEl = document.getElementById(card.addTaskID);
        const tasksDivEl = document.getElementById(card.tasksDiv);

        cardEl.id = `card${newCardID}`;
        cardNameIDEl.id = `cardName${newCardID}`;
        cardSettingsIDEl.id = `cardSettings${newCardID}`;
        addTaskIDEl.id = `addTask${newCardID}`;
        tasksDivEl.id = `tasksDiv${newCardID}`;
    }

    /**
     * Update card name view
     * @param {string} name
     */
    updateCardName(name) {
        document.getElementById(this.card.cardNameID).innerText = name;
    }

    /**
     * Render task
     * @param {TaskController} task
     */
    renderTask(task) {
        task.render();
    }

    /**
     * Remove card view
     */
    removeCard() {
        document.getElementById(this.card.cardHtmlID).remove();
    }

    /**
     * Add all event listeners
     * @param {JSON} card
     */
    addEventListeners(card) {
        document.getElementById(card.cardNameID).addEventListener('focus', (event) => {
            event.target.addEventListener('keydown', this.onKeyDownBlur);
        });
        document.getElementById(card.cardNameID).addEventListener('focusout', (event) => {
            event.target.removeEventListener('keydown', this.onKeyDownBlur);
            const newName = event.target.innerText;
            // TODO: сделать проверку на название из пробелов
            if (newName === '') {
                if (card.isInitialized) {
                    event.target.innerHTML = card.cardName;
                } else {
                    document.getElementById(card.cardHtmlID).remove();
                    this.eventBus.emit('cardView:deleteCard', null);
                }
            } else {
                this.eventBus.emit('cardView:updateCardName', newName);
            }
        });
        document.getElementById(card.addTaskID).addEventListener('click', () => {
            setTimeout(() => {
                this.eventBus.emit('cardView:addNewTask', null);
            }, 50);
        });
        document.getElementById(card.cardSettingsID).addEventListener('click', () => {
            document.getElementById(card.cardHtmlID).remove();
            this.eventBus.emit('cardView:deleteCard', null);
        });
        this.addDragAndDropEventListeners(card);
    }

    /**
     * Add event listeners related to drag and drop
     * @param {JSON} card
     */
    addDragAndDropEventListeners(card) {
        document.getElementById(card.addTaskID).addEventListener('dragenter', () => {
            this.tasksDiv.appendChild(window.draggedTask);
        });
        document.getElementById(card.addTaskID).addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        document.getElementById(card.addTaskID).addEventListener('drop', () => {
            window.taskDropped = true;
            if (window.startTasksDiv === this.tasksDiv) {
                this.eventBus.emit('cardView:taskOrderChanged', window.draggedTask);
            } else {
                this.eventBus.emit('cardView:taskMovedToThisCard', [window.draggedTask, window.startTasksDiv]);
            }
        });
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
     * Render card
     * @param {JSON} card
     */
    render(card) {
        this.card = card;
        const html = cardTemplate(card);
        this.el.appendChild(rendering.createElementsFromTmpl(html));
        this.tasksDiv = document.getElementById(card.tasksDiv);
        this.addEventListeners(card);
        this.eventBus.emit('cardView:viewRendered', this.tasksDiv);
        if (!card.isInitialized) {
            document.getElementById(card.cardNameID).focus();
        }
    }
}
