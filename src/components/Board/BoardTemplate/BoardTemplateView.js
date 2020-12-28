import BaseView from '../../../views/BaseView/BaseView.js';
import rendering from '../../../utils/rendering.js';
import boardTemplate from '../Board.tmpl.xml';

/**
 * Board template view
 */
export default class BoardTemplateView extends BaseView {
    /**
     * BoardTemplateView constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * Add all event listeners
     * @param {JSON} board
     */
    addEventListeners(board) {
        document.getElementById(board.boardHtmlID).addEventListener('click', () => {
            this.eventBus.emit('boardTemplateView:createBoard', null);
        });
    }

    /**
     * Render board
     * @param {JSON} board
     */
    render(board) {
        const html = boardTemplate(board);
        this.el.appendChild(rendering.createElementsFromTmpl(html));
        this.addEventListeners(board);
    }
}
