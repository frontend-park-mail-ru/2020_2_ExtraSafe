/**
 * Base controller class
 * @typedef {Object} BaseController
 */
export default class BaseController {
    /**
     * Base controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        this.el = el;
        this.router = router;
    }
}
