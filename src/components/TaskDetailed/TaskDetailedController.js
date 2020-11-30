import BaseController from '../../controllers/BaseController.js';
import TaskDetailedModel from './TaskDetailedModel.js';
import TaskDetailedView from './TaskDetailedView.js';
import TagAddPopup from './TagAddPopup/TagAddPopup.js';
import TagCreatePopup from './TagCreatePopup/TagCreatePopup.js';
import globalEventBus from '../../utils/globalEventBus.js';

/**
 * Task detailed controller
 */
export default class TaskDetailedController extends BaseController {
    /**
     * Task detailed controller constructor
     * @param {HTMLElement} el
     */
    constructor(el) {
        super(el);
        this.model = new TaskDetailedModel(this.eventBus);
        this.view = new TaskDetailedView(el, this.eventBus);
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('taskDetailedView:updateTaskDescription', (newDescription) => {
            this.model.updateTaskDescription(newDescription);
        });
        this.eventBus.on('taskDetailedView:updateTaskName', (newTaskName) => {
            this.model.updateTaskName(newTaskName);
            this.eventBus.emit('taskDetailedController:taskNameUpdated', null);
        });
        this.eventBus.on('taskDetailedView:addTag', () => {
            this.tagAddPopup.render(this.model.task.tags, this.model.board.boardTags);
        });
    }

    /**
     * Add event listeners related to tags
     */
    addTagEventListeners() {
        this.tagAddPopup.eventBus.on('tagAddPopup:tagAdded', (tag) => {
            this.model.addTag(tag);
            this.view.addTag(tag);
            this.eventBus.emit('taskDetailedController:tagAdded', tag);
        });
        this.tagAddPopup.eventBus.on('tagAddPopup:tagRemoved', (tag) => {
            this.model.removeTag(tag);
            this.view.removeTag(tag);
            this.eventBus.emit('taskDetailedController:tagRemoved', tag);
        });
        this.tagAddPopup.eventBus.on('tagAddPopup:tagCreate', () => {
            this.tagCreatePopup.render();
        });
        this.tagAddPopup.eventBus.on('tagAddPopup:tagEdit', (tag) => {
            this.tagCreatePopup.render(tag);
        });
        this.tagCreatePopup.eventBus.on('tagCreatePopup:tagClose', () => {
            this.tagAddPopup.render(this.model.task.tags, this.model.board.boardTags);
        });
        this.tagCreatePopup.eventBus.on('tagCreatePopup:tagCreate', ([tagName, tagColor]) => {
            this.model.createTag(tagName, tagColor);
        });
        this.tagCreatePopup.eventBus.on('tagCreatePopup:tagEdit', (tag) => {
            this.model.changeTag(tag);
            if (tag.isSelected) {
                this.view.changeTag(tag);
            }
            globalEventBus.emit('taskDetailedController:tagEdit', tag);
            this.tagAddPopup.render(this.model.task.tags, this.model.board.boardTags);
        });
        this.eventBus.on('taskDetailedModel:createTagSuccess', (responseBody) => {
            const tag = this.model.addCreatedTag(responseBody);
            this.view.addTag(tag);
            this.eventBus.emit('taskDetailedController:tagAdded', tag);
            this.tagAddPopup.render(this.model.task.tags, this.model.board.boardTags);
        });
    }

    /**
     * Add event listeners related to attachments
     */
    addAttachmentsEventListeners() {
        this.eventBus.on('taskDetailedView:uploadFile', (file) => {
            this.model.uploadFileOnServer(file);
        });
        this.eventBus.on('taskDetailedModel:uploadFileOnServerSuccess', (responseBody) => {
            console.log('taskDetailedModel:uploadFileOnServerSuccess', responseBody);
            const newFile = this.model.addFile(responseBody);
            this.view.addAttachment(newFile);
        });
        this.eventBus.on('taskDetailedModel:uploadFileOnServerFailed', (codes) => {
            console.log('taskDetailedModel:uploadFileOnServerFailed', codes);
        });
        this.eventBus.on('taskDetailedView:removeAttachment', (fileObj) => {
            this.model.removeAttachment(fileObj);
        });
    }

    /**
     * Render task detailed view
     * @param {Object} board
     * @param {Object} task
     */
    render(board, task) {
        this.model.task = task;
        this.model.board = board;
        this.view.render(task);
        this.addEventListeners();

        const tagPopupEl = document.getElementById('tagPopup');
        this.tagAddPopup = new TagAddPopup(tagPopupEl);
        this.tagCreatePopup = new TagCreatePopup(tagPopupEl);
        this.addTagEventListeners();
        this.addAttachmentsEventListeners();
    }
}
