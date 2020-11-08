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
