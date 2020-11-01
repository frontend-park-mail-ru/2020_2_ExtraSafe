import globalEventBus from '../utils/globalEventBus.js';
import EventBus from '../utils/eventBus.js';

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
        this.eventBus = new EventBus();
        globalEventBus.on('changeView', () => {
            this.eventBus.offAll();
        });
        this.addGlobalEventListeners();
    }

    /**
     * Add all global event listeners
     */
    addGlobalEventListeners() {};

    /**
     * Add all event listeners
     */
    addEventListeners() {};

    /**
     * Render view
     */
    render() {
        globalEventBus.emit('changeView', null);
        this.addEventListeners();
    };
}
