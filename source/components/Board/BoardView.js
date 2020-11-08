import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';
import './Board.tmpl.js';

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
     * @param {JSON} boardJSON
     */
    addEventListeners(boardJSON) {
        document.getElementById(boardJSON.boardID).addEventListener('click', () => {
            this.eventBus.emit('boardView:openBoard', null);
        });
    }

    /**
     * Render board
     * @param {JSON} boardJSON
     */
    render(boardJSON) {
        const html = window.fest['components/Board/Board.tmpl'](boardJSON);
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.addEventListeners(boardJSON);
    }
}
