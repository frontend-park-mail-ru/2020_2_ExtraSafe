import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import currentBoardTemplate from './CurrentBoardView.tmpl.xml';

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
     * Update card name view
     * @param {string} name
     */
    updateBoardName(name) {
        document.getElementById('boardName').innerText = name;
    }

    /**
     * Update card order in HTML
     * @param {string} cardHtmlID
     * @param {number} order
     */
    updateCardOrder(cardHtmlID, order) {
        document.getElementById(cardHtmlID).dataset.order = order.toString();
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
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('addCardButton').addEventListener('click', () => {
            setTimeout(() => {
                this.eventBus.emit('currentBoardView:addNewCard', null);
            }, 50);
        }, false);
        document.getElementById('boardName').addEventListener('focus', () => {
            event.target.addEventListener('keydown', this.onKeyDownBlur);
        });
        document.getElementById('boardName').addEventListener('focusout', (event) => {
            event.target.removeEventListener('keydown', this.onKeyDownBlur);
            this.eventBus.emit('currentBoardView:boardNameUpdate', event.target.innerText);
        });
        document.getElementById('boardSettings').addEventListener('click', () => {
            this.eventBus.emit('currentBoardView:deleteBoard', null);
        });
        document.getElementById('addMember').addEventListener('click', () => {
            this.eventBus.emit('currentBoardView:addMember', null);
        });
    }

    /**
     * Render current board view.
     * @param {JSON} board
     */
    render(board) {
        Navbar.navbarShow();
        this.el.innerHTML = currentBoardTemplate(board);

        this.taskDetailed = document.getElementById('taskDetailed');
        this.cardsDiv = document.getElementById('cardsDiv');

        this.addEventListeners();
        this.eventBus.emit('currentBoardView:viewRendered', [this.cardsDiv, this.taskDetailed]);
    }
}
