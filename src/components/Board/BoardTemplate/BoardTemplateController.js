import BaseController from '../../../controllers/BaseController.js';
import BoardTemplateView from './BoardTemplateView.js';
import BoardTemplateModel from './BoardTemplateModel.js';
import globalEventBus from '../../../utils/globalEventBus.js';

/**
 * Board controller
 * @typedef {Object} BoardController
 * @extends BaseController
 */
export default class BoardTemplateController extends BaseController {
    /**
     * Board controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     * @param {string} templateID
     * @param {string} templateName
     * @param {string} templateDescription
     */
    constructor(el, router, templateID, templateName, templateDescription) {
        super(el, router);
        this.view = new BoardTemplateView(el, this.eventBus);
        this.model = new BoardTemplateModel(this.eventBus, templateID, templateName, templateDescription);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('boardTemplateView:createBoard', () => {
            globalEventBus.emit('boardTemplateController:createBoard', this.model.board);
        });
    }

    /**
     * Render board
     */
    render() {
        this.addEventListeners();
        this.view.render(this.model.board);
    }
}
