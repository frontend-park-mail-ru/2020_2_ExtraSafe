/**
 * BaseView class.
 * @class BaseView
 * @module BaseView
 */
export default class BaseView {
    /**
     * Constructor for a BaseView.
     * @constructor
     * @param {object} el
     * @param {*} router
     * @param {*} args
     */
    constructor(el, router, args) {
        this.el = el;
        this.router = router;
        this.args = args;
    }

    /**
     * Empty render view function to be implemented.
     */
    render() {}
}
