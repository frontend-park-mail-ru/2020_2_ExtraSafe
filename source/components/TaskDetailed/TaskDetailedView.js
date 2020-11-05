import BaseView from '../../views/BaseView/BaseView.js';
import './TaskDetailedView.tmpl.js';

/**
 * Task detailed view
 */
export default class TaskDetailedView extends BaseView {
    /**
     * Task detailed view constructor
     * @param {HTMLElement} el
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * Render task detailed view
     */
    render() {
        this.el.style.display = 'flex';
        this.el.innerHTML = window.fest['components/TaskDetailed/TaskDetailedView.tmpl']();
    }
}
