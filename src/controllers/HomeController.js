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
            this.addBoardPopup.eventBus.on('addBoardPopup:addBoardFromTmpl', (boardName) => {
                this.model.addNewBoardOnServerFromTmpl(boardName);
            });

            this.model.getBoardsFromServer();
        });
        this.eventBus.on('homeModel:getBoardsFromServerFailed', (errorCodes) => {
            console.log('homeModel:getBoardsFromServerFailed');
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('homeModel:getBoardsFromServerSuccess', (boards) => {
            console.log('homeModel:getBoardsFromServerSuccess');
            console.log(boards);
            userSession.setBoards(boards);
            if (Array.isArray(boards) && boards.length) {
                for (const board of boards) {
                    this.addBoard(board.boardID, board.boardName);
                }
            }
        });
        globalEventBus.on('navbar:addBoard', (wsBoard) => {
            this.boards = [];
            this.render();
        });
        globalEventBus.on('boardTemplateController:createBoard', (templateData) => {
            this.addBoardPopup.render(templateData);
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
