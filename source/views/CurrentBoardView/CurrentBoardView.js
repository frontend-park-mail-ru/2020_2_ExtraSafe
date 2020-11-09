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
     * Render card
     * @param {CardController} newCard
     */
    renderCard(newCard) {
        newCard.render();
    }

    /**
     * update board name
     * @param {JSON} boardJSON
     */
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
     * Render Current Board view.
     * @param {JSON} boardJSON
     */
    render(boardJSON) {
        Navbar.navbarShow();
        this.el.innerHTML = window.fest['views/CurrentBoardView/CurrentBoardView.tmpl'](boardJSON);
        this.addEventListeners();
        this.eventBus.emit('currentBoardView:addCardsFromServer', this.cardsDiv);
    }
}
