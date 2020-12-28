import BaseController from './BaseController.js';
import HomeView from '../views/HomeView/HomeView.js';
import HomeModel from '../models/HomeModel.js';
import AddBoardPopup from '../components/AddBoardPopup/AddBoardPopup.js';
import userSession from '../utils/userSession.js';
import BoardController from '../components/Board/BoardController.js';
import globalEventBus from '../utils/globalEventBus.js';
import BoardTemplateController from '../components/Board/BoardTemplate/BoardTemplateController.js';

/**
 * Home controller
 * @typedef {Object} HomeController
 * @extends BaseController
 */
export default class HomeController extends BaseController {
    /**
     * Home controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new HomeView(el, this.eventBus);
        this.model = new HomeModel(this.eventBus, router);
        this.boards = [];
        this.templates = [];

        globalEventBus.on('navbar:addBoard', (wsBoard) => {
            this.boards = [];
            this.render();
        });
        globalEventBus.on('boardTemplateController:createBoard', (templateData) => {
            this.addBoardPopup.render(templateData);
        });
    }

    /**
     * Add board data
     * @param {number} boardID
     * @param {string} boardName
     */
    addBoard(boardID = -1, boardName = '') {
        const newBoard = new BoardController(this.boardsDiv, this.router, boardID, boardName);
        this.boards.push(newBoard);

        this.view.renderBoard(newBoard);
    }

    /**
     * Add board template data
     * @param {string} templateSlug
     * @param {string} templateName
     * @param {string} templateDescription
     */
    addBoardTmpl(templateSlug, templateName, templateDescription) {
        const newBoard = new BoardTemplateController(this.templatesDiv, this.router,
            templateSlug, templateName, templateDescription);
        this.templates.push(newBoard);

        this.view.renderBoard(newBoard);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('homeView:addBoard', () => {
            this.addBoardPopup.render();
        });
        this.eventBus.on('homeModel:boardCreateFailed', (errorCodes) => {
            console.log('homeModel:boardCreateFailed');
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('homeModel:boardCreateSuccess', (data) => {
            console.log('homeModel:boardCreateSuccess');
            console.log(data);

            userSession.addBoard(data);
            this.addBoard(data.boardID, data.name);
            this.router.open(`/board/${data.boardID}`);
        });
        this.eventBus.on('homeView:viewRendered', ([boardsDiv, templatesDiv]) => {
            this.boardsDiv = boardsDiv;
            this.templatesDiv = templatesDiv;

            this.addBoardPopup = new AddBoardPopup(document.getElementById('addBoardPopup'));
            this.addBoardPopup.eventBus.on('addBoardPopup:addBoard', (boardName) => {
                this.model.addNewBoardOnServer(boardName);
            });
            this.addBoardPopup.eventBus.on('addBoardPopup:addBoardFromTmpl', (boardData) => {
                this.model.addNewBoardOnServerFromTmpl(boardData);
            });

            this.model.getBoardsFromServer();
        });
        this.eventBus.on('homeModel:getBoardsFromServerFailed', (errorCodes) => {
            console.log('homeModel:getBoardsFromServerFailed');
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('homeModel:getBoardsFromServerSuccess', (responseBody) => {
            console.log('homeModel:getBoardsFromServerSuccess');
            console.log(responseBody);
            userSession.setBoards(responseBody.boards);
            if (Array.isArray(responseBody.boards) && responseBody.boards.length) {
                for (const board of responseBody.boards) {
                    this.addBoard(board.boardID, board.boardName);
                }
            }
            if (Array.isArray(responseBody.templates) && responseBody.templates.length) {
                for (const template of responseBody.templates) {
                    this.addBoardTmpl(template.templateSlug, template.templateName, template.templateDescription);
                }
            }
        });
    }

    /**
     * Render view
     */
    render() {
        super.render();
        this.view.render();
    }
}
