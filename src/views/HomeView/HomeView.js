import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import homeViewTemplate from './HomeView.tmpl.xml';

/**
 * Home view
 */
export default class HomeView extends BaseView {
    /**
     * Home view constructor
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * Render board view
     * @param {BoardController} board
     */
    renderBoard(board) {
        board.render();
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        document.getElementById('addBoard').addEventListener('click', () => {
            this.eventBus.emit('homeView:addBoard', null);
        });
    }

    /**
     * Render Home view.
     */
    render() {
        Navbar.navbarShow();
        this.el.innerHTML = homeViewTemplate();
        this.addEventListeners();

        this.boardsDiv = document.getElementById('boardsDiv');
        this.eventBus.emit('homeView:viewRendered', this.boardsDiv);
    }
}
