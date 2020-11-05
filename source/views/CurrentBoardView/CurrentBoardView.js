import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import './CurrentBoardView.tmpl.js';
import '../../components/Card/Card.tmpl.js';

/**
 * Class Current board view.
 */
export default class CurrentBoardView extends BaseView {
    /**
     * CurrentBoardView constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * Render cards
     * @param {Object} cards
     */
    renderCards(cards) {
        this.cardsDiv.innerHTML = '';

        // eslint-disable-next-line no-unused-vars
        for (const [cardID, card] of Object.entries(cards)) {
            this.cardsDiv.innerHTML += window.fest['components/Card/Card.tmpl'](card.templateJSON);
        }

        for (const [cardID, card] of Object.entries(cards)) {
            document.getElementById(cardID).addEventListener('focusout', () => {
                const newName = document.getElementById(card.templateJSON.cardNameID).innerHTML;
                this.eventBus.emit('currentBoardView:updateCardName', [cardID, newName]);
            });
            document.getElementById(card.templateJSON.addTaskID).addEventListener('click', () => {
                this.eventBus.emit('currentBoardView:addNewTask', cardID);
            });

            for (const [taskID, task] of card.templateJSON.tasks.entries()) {
                const taskEl = document.getElementById(task.taskNameID);
                taskEl.addEventListener('focusout', () => {
                    const newName = taskEl.innerHTML;
                    this.eventBus.emit('currentBoardView:updateTaskName', [cardID, taskID, newName]);
                }, false);
                if (task.contentEditable === 'false') {
                    taskEl.addEventListener('click', () => {
                        this.eventBus.emit('currentBoardView:openTaskDetailed', task);
                    }, false);
                }
            }
        }
    }

    /**
     * Function called on taskNameUpdated event
     * @param {JSON} task
     */
    onTaskNameUpdated(task) {
        const taskEl = document.getElementById(task.taskNameID);
        taskEl.contentEditable = 'false';
        taskEl.style.wordBreak = 'break-word';
        taskEl.addEventListener('click', () => {
            this.eventBus.emit('currentBoardView:openTaskDetailed', task);
        }, false);
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        this.cardsDiv = document.getElementById('cardsDiv');
        document.getElementById('addCardButton')
            .addEventListener('click', () => {
                this.eventBus.emit('currentBoardView:addNewCard', null);
            }, false);
    }

    /**
     * setup template input data
     * @return {JSON} templateData
     */
    templateJSONSetup() {
        return {
            boardName: 'Лучшая тестовая доска',
            boardCollaborators: [],
            cards: [],
        };
    }

    /**
     * Render Current Board view.
     */
    render() {
        Navbar.navbarShow();
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['views/CurrentBoardView/CurrentBoardView.tmpl'](templateInput);
        this.addEventListeners();
    }
}
