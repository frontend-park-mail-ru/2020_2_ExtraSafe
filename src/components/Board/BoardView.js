import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';
import boardTemplate from './Board.tmpl.xml';

/**
 * Board view
 */
export default class BoardView extends BaseView {
    /**
     * BoardView constructor.
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
            this.eventBus.emit('boardView:openBoard', null);
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
