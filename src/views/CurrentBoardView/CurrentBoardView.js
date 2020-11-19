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
     * Update card order in HTML
     * @param {string} cardHtmlID
     * @param {number} order
     */
    updateCardOrder(cardHtmlID, order) {
        document.getElementById(cardHtmlID).dataset.order = order.toString();
    }

    // /**
    //  * update board name
    //  * @param {string} boardName
    //  */
    // updateBoardName(boardName) {
    //     document.getElementById('boardName').innerHTML = boardName;
    // }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('addCardButton').addEventListener('click', () => {
            this.eventBus.emit('currentBoardView:addNewCard', null);
        }, false);
        document.getElementById('boardName').addEventListener('focusout', (event) => {
            this.eventBus.emit('currentBoardView:boardNameUpdate', event.target.innerText);
        });
        document.getElementById('boardSettings').addEventListener('click', () => {
            this.eventBus.emit('currentBoardView:deleteBoard', null);
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
