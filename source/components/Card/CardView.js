import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';

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
            const newName = event.target.innerHTML;
            this.eventBus.emit('cardView:updateCardName', newName);
        });
        document.getElementById(cardJSON.addTaskID).addEventListener('click', () => {
            this.eventBus.emit('cardView:addNewTask', this.tasksDiv);
        });
        document.getElementById(cardJSON.cardSettingsID).addEventListener('click', () => {
            document.getElementById(cardJSON.cardID).remove();
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
        const html = window.fest['components/Card/Card.tmpl'](cardJSON);
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.tasksDiv = document.getElementById(cardJSON.tasksDiv);
        this.addEventListeners(cardJSON);
        document.getElementById(cardJSON.cardNameID).focus();
    }
}
