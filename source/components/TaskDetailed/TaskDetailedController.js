import BaseController from '../../controllers/BaseController.js';
import TaskDetailedModel from './TaskDetailedModel.js';
import TaskDetailedView from './TaskDetailedView.js';

/**
 * Task detailed controller
 */
export default class TaskDetailedController extends BaseController {
    /**
     * Task detailed controller constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.model = new TaskDetailedModel(this.eventBus);
        this.view = new TaskDetailedView(el, this.eventBus);
    }

    /**
     * Render task detailed view
     * @param {JSON} json
     */
    render(json) {
        this.view.render();
    }
}
