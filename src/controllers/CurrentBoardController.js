import BaseController from './BaseController.js';
import CurrentBoardView from '../views/CurrentBoardView/CurrentBoardView.js';
import CurrentBoardModel from '../models/CurrentBoardModel.js';
import TaskDetailedController from '../components/TaskDetailed/TaskDetailedController.js';
import globalEventBus from '../utils/globalEventBus.js';
import CardController from '../components/Card/CardController.js';

/**
 * Current board controller
 * @typedef {Object} CurrentBoardController
 * @extends BaseController
 */
export default class CurrentBoardController extends BaseController {
    /**
     * Current board controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     * @param {string} boardName
     * @param {string} boardID
     */
    constructor(el, router, boardName= '', boardID= '') {
        super(el, router);
        this.view = new CurrentBoardView(el, this.eventBus);
        this.model = new CurrentBoardModel(this.eventBus, boardName, boardID);
        this.cards = [];
    }

    /**
     * Create cards from server
     * @param {[JSON]} cards
     */
    addCardsFromJSON(cards) {
        if (!(Array.isArray(cards) && cards.length)) {
            return;
        }

        cards.sort(function(a, b) {
            if (a.order < b.order) {
                return -1;
            } else {
                return 1;
            }
        });

        for (const card of cards) {
            const newCard = this.addCard(card.cardID, card.name, card.order);
            newCard.addTasksFromJSON(card.tasks);
        }
    }

    /**
     * Add card
     * @param {number} cardID
     * @param {string} cardName
     * @param {number} order
     * @return {CardController}
     */
    addCard(cardID = -1, cardName = '', order = this.cards.length) {
        const cardObj = {
            boardID: this.model.board.boardID,
            cardID: cardID,
            cardName: cardName,
            order: order,
            isInitialized: cardID !== -1,
        };
        const newCard = new CardController(this.cardsDiv, cardObj);
        this.cards.splice(order, 0, newCard);

        this.view.renderCard(newCard);
        return newCard;
    }

    /**
     * Delete card by it's ID
     * @param {string} cardID
     */
    deleteCardByID(cardID) {
        let cardInitialized = false;
        for (const [cardIndex, card] of this.cards.entries()) {
            if (card.model.card.cardID === cardID) {
                cardInitialized = card.model.card.isInitialized;
                this.cards.splice(cardIndex, 1);
            }
        }
        if (cardInitialized) {
            this.updateCardOrder();
        }
    }

    /**
     * Update card order
     */
    updateCardOrder() {
        const cards = [];
        for (const [cardIndex, card] of this.cards.entries()) {
            card.model.card.order = cardIndex;
            card.model.cardJSON.order = cardIndex;
            cards.push({
                cardID: card.model.cardJSON.cardID,
                order: card.model.cardJSON.order,
            });

            this.view.updateCardOrder(card.model.card.cardID, cardIndex);
        }
        this.model.changeCardOrderOnServer(cards);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('currentBoardView:viewRendered', ([cardsDiv, taskDetailed]) => {
            this.cardsDiv = cardsDiv;
            this.taskDetailed = new TaskDetailedController(taskDetailed);
            this.model.getBoardData();
        });
        this.eventBus.on('currentBoardModel:getBoardFailed', (errorCodes) => {
            console.log('currentBoardModel:getBoardFailed');
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('currentBoardModel:getBoardSuccess', (responseJSON) => {
            console.log('currentBoardModel:getBoardSuccess');
            console.log(responseJSON);
            this.addCardsFromJSON(responseJSON.cards);
        });
        this.eventBus.on('currentBoardView:addNewCard', () => {
            this.addCard();
        });
        this.eventBus.on('currentBoardView:boardNameUpdate', (boardName) => {
            this.model.updateBoardName(boardName);
        });
        this.eventBus.on('currentBoardView:deleteBoard', () => {
            this.model.deleteBoard();
        });
        this.eventBus.on('currentBoardModel:boardDeleted', () => {
            console.log('currentBoardModel:boardDeleted');
            this.router.open('/');
        });
        globalEventBus.on('cardView:deleteCardFromArray', (cardID) => {
            this.deleteCardByID(cardID);
        });
    }

    /**
     * Render view
     */
    render() {
        super.render();
        this.view.render(this.model.board);
    }
}
