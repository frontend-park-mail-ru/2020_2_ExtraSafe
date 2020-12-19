import BaseController from './BaseController.js';
import CurrentBoardView from '../views/CurrentBoardView/CurrentBoardView.js';
import CurrentBoardModel from '../models/CurrentBoardModel.js';
import TaskDetailedController from '../components/TaskDetailed/TaskDetailedController.js';
import globalEventBus from '../utils/globalEventBus.js';
import CardController from '../components/Card/CardController.js';
import MembersPopup from '../components/MembersPopup/MembersPopup.js';
import MemberInvitePopup from '../components/MemberInvitePopup/MemberInvitePopup.js';
import network from '../utils/network.js';

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
            if (a.cardOrder < b.cardOrder) {
                return -1;
            } else {
                return 1;
            }
        });

        for (const card of cards) {
            const newCard = this.addCard(card.cardID, card.cardName, card.cardOrder);
            newCard.addTasksFromJSON(card.cardTasks);
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
        const newCard = new CardController(this.cardsDiv, this.model.board, cardObj);
        this.cards.push(newCard);

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
            cards.push({
                cardID: card.model.card.cardID,
                order: card.model.card.order,
            });

            this.view.updateCardOrder(card.model.card.cardHtmlID, cardIndex);
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
            // this.model.getBoardData();
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
            this.addCardsFromJSON(responseJSON.boardCards);
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
        globalEventBus.on('cardController:deleteCardFromArray', (cardID) => {
            this.deleteCardByID(cardID);
        });
    }

    /**
     * Initialize members popups
     */
    initMembersPopups() {
        const membersPopupEl = document.getElementById('membersPopup');
        this.membersPopup = new MembersPopup(membersPopupEl);
        this.memberInvitePopup = new MemberInvitePopup(membersPopupEl);
    }

    /**
     * Add event listeners related to members
     */
    addMembersEventListeners() {
        this.eventBus.on('currentBoardView:addMember', () => {
            this.membersPopup.render(this.model.board);
        });
        this.membersPopup.eventBus.on('membersPopup:memberDelete', (member) => {
            this.model.memberExpel(member);
        });
        this.membersPopup.eventBus.on('membersPopup:memberInvite', () => {
            this.memberInvitePopup.render();
        });
        this.memberInvitePopup.eventBus.on('memberInvitePopup:memberInvite', (memberUsername) => {
            this.model.memberInvite(memberUsername);
        });
        this.eventBus.on('currentBoardModel:memberInviteFailed', (codes) => {
            console.log('currentBoardModel:memberInviteFailed', codes);
        });
        this.eventBus.on('currentBoardModel:memberInviteSuccess', (responseBody) => {
            console.log('currentBoardModel:memberInviteSuccess', responseBody);
            // TODO: сделать добавление на вьюху доски и разобраться с рендером попапа тут
            this.membersPopup.render(this.model.board);
        });
        this.eventBus.on('currentBoardModel:memberExpelFailed', (codes) => {
            console.log('currentBoardModel:memberExpelFailed', codes);
        });
        this.eventBus.on('currentBoardModel:memberExpelSuccess', (responseBody) => {
            console.log('currentBoardModel:memberExpelSuccess', responseBody);
            // TODO: сделать удаление с вьюхи доски
        });
        this.memberInvitePopup.eventBus.on('memberInvitePopup:popupClose', () => {
            this.membersPopup.render(this.model.board);
        });
    }

    /**
     * Add event listeners related to web sockets
     */
    addWsEventListeners() {
        this.model.board.ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log(data);

            switch (data.method) {
            case 'ChangeBoard':
                this.view.updateBoardName(data.body.boardName);
                break;
            case 'AddMember':
                this.model.addMember(data.body);
                // TODO: сделать добавление на вьюху доски
                break;
            case 'RemoveMember':
                this.model.deleteMember(data.body.memberUsername);
                // TODO: сделать удаление с вьюхи доски
                break;
            case 'CreateCard':
                this.addCard(data.body.cardID, data.body.cardName);
                break;
            default:
                break;
            }
        });
    }

    /**
     * Render view
     */
    render() {
        super.render();
        this.model.board.ws = network.webSocketConnection(this.model.board.boardID);
        this.model.getBoardData().then((responseBody) => {
            this.view.render(this.model.board);
            this.eventBus.emit('currentBoardModel:getBoardSuccess', responseBody);
            this.initMembersPopups();
            this.addMembersEventListeners();
            this.addWsEventListeners();
        });
    }
}
