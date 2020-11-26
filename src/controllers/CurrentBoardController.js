import BaseController from './BaseController.js';
import CurrentBoardView from '../views/CurrentBoardView/CurrentBoardView.js';
import CurrentBoardModel from '../models/CurrentBoardModel.js';
import TaskDetailedController from '../components/TaskDetailed/TaskDetailedController.js';
import globalEventBus from '../utils/globalEventBus.js';

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
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('currentBoardView:addNewCard', (cardsDiv) => {
            this.model.addNewCard(cardsDiv);
        });
        this.eventBus.on('currentBoardModel:cardAdded', (newCard) => {
            this.view.renderCard(newCard);
        });
        this.eventBus.on('currentBoardView:addCardsFromServer', (cardsDiv) => {
            this.model.cardsDiv = cardsDiv;
            this.model.getBoardData();
        });
        this.eventBus.on('currentBoardModel:getBoardSuccess', (responseJSON) => {
            this.model.setBoardData(responseJSON);
        });
        this.eventBus.on('currentBoardModel:boardDataSet', (boardJSON) => {
            this.view.updateBoardName(boardJSON);
        });
        this.eventBus.on('currentBoardView:boardNameUpdate', (boardName) => {
            this.model.updateBoardName(boardName);
        });
        this.eventBus.on('currentBoardView:deleteBoard', () => {
            this.model.deleteBoard();
        });
        this.eventBus.on('currentBoardModel:boardDeleted', () => {
            this.router.open('/');
        });
        this.eventBus.on('currentBoardModel:boardSetFailed', (errorCodes) => {
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('currentBoardModel:boardSetSuccess', (data) => {
            console.log(data);
        });
        globalEventBus.on('cardView:deleteCardFromArray', (cardID) => {
            this.model.deleteCardByID(cardID);
        });
    }

    /**
     * Render view
     */
    render() {
        super.render();
        this.view.render(this.model.board);
        this.taskDetailed = new TaskDetailedController(document.getElementById('taskDetailed'));
    }
}
