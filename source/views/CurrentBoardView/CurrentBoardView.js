import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import './CurrentBoardView.tmpl.js';
import '../../components/Card/Card.tmpl.js';
import rendering from '../../utils/rendering.js';

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
     * Render card
     * @param {CardController} newCard
     */
    renderCard(newCard) {
        newCard.render();
    }

    /**
     * Render cards
     * @param {Object} cards
     */
    renderCards(cards) {
        // this.cardsDiv.innerHTML = '';

        // eslint-disable-next-line no-unused-vars
        for (const [cardID, card] of Object.entries(cards)) {
            // this.cardsDiv.innerHTML += window.fest['components/Card/Card.tmpl'](card.templateJSON);
            const html = window.fest['components/Card/Card.tmpl'](card.templateJSON);
            this.cardsDiv.appendChild(...rendering.createElementsFromTmpl(html));
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

    updateBoardName(boardJSON) {
        document.getElementById('boardName').innerHTML = boardJSON.boardName;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        this.cardsDiv = document.getElementById('cardsDiv');
        document.getElementById('addCardButton')
            .addEventListener('click', () => {
                this.eventBus.emit('currentBoardView:addNewCard', this.cardsDiv);
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
        this.eventBus.emit('currentBoardView:addCardsFromServer', this.cardsDiv);
    }
}
