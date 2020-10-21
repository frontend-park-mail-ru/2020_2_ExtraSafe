import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import './HomeView.tmpl.js';

/**
 * Home view
 */
export default class HomeView extends BaseView {
    /**
     * Home view constructor
     * @constructor
     * @param {HTMLElement} el - Root application div.
     */
    constructor(el) {
        super(el);
    }

    /**
     * Render Home view.
     */
    render() {
        Navbar.navbarShow();
        this.el.innerHTML = window.fest['views/HomeView/HomeView.tmpl']();
    }
}
