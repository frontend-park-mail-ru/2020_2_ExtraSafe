/**
 * BaseView class.
 * @class BaseView
 * @module BaseView
 */
export default class BaseView {
    /**
     * Constructor for a BaseView.
     * @param {HTMLElement} el
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        this.el = el;
        this.eventBus = eventBus;
    }

    /**
     * Empty render view function to be implemented.
     */
    render() {}
}
