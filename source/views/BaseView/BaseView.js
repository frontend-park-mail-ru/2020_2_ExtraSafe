/**
 * BaseView class.
 * @class BaseView
 * @module BaseView
 */
export default class BaseView {
    /**
     * Constructor for a BaseView.
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
    }

    /**
     * Empty render view function to be implemented.
     */
    render() {}
}
