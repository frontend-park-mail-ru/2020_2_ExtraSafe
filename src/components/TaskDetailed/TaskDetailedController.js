import BaseController from '../../controllers/BaseController.js';
import TaskDetailedModel from './TaskDetailedModel.js';
import TaskDetailedView from './TaskDetailedView.js';
import TagAddPopup from './TagAddPopup/TagAddPopup.js';
import TagCreatePopup from './TagCreatePopup/TagCreatePopup.js';
import CheckListPopup from './CheckListPopup/CheckListPopup.js';

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
     * Initialize popups
     */
    initPopups() {
        const tagPopupEl = document.getElementById('tagPopup');
        this.tagAddPopup = new TagAddPopup(tagPopupEl);
        this.tagCreatePopup = new TagCreatePopup(tagPopupEl);

        const checkListPopupEl = document.getElementById('checkListPopup');
        this.checkListPopup = new CheckListPopup(checkListPopupEl);
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
        this.eventBus.on('taskDetailedView:addCheckList', () => {
            this.checkListPopup.render();
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
            console.log(tagName, tagColor);
            const tag = this.model.createTag(tagName, tagColor);
            this.view.addTag(tag);
            this.eventBus.emit('taskDetailedController:tagAdded', tag);
            this.tagAddPopup.render(this.model.task.tags, this.model.board.boardTags);
        });
        this.tagCreatePopup.eventBus.on('tagCreatePopup:tagEdit', (tag) => {
            if (tag.isSelected) {
                this.view.changeTag(tag);
                this.eventBus.emit('taskDetailedController:tagEdit', tag);
            }
            this.model.changeTag(tag);
            this.tagAddPopup.render(this.model.task.tags, this.model.board.boardTags);
        });
    }

    /**
     * Add event listeners related to attachments
     */
    addAttachmentsEventListeners() {
        this.eventBus.on('taskDetailedView:uploadFile', (file) => {
            this.model.uploadFile(file);
        });
        this.eventBus.on('taskDetailedModel:uploadFileSuccess', (fileObj) => {
            this.view.addAttachment(fileObj);
        });
        this.eventBus.on('taskDetailedView:removeAttachment', (fileObj) => {
            this.model.removeAttachment(fileObj);
        });
    }

    /**
     * Add event listeners related to check-lists
     */
    addCheckListsEventListeners() {
        this.checkListPopup.eventBus.on('checkListPopup:popupCreate', (checkListName) => {
            const newCheckList = this.model.createCheckList(checkListName);
            this.view.addCheckList(newCheckList);
        });
        this.eventBus.on('taskDetailedView:removeCheckList', (checkList) => {
            this.model.removeCheckList(checkList);
        });
    }

    /**
     * Add event listeners related to check-list elements
     */
    addCheckListsElementsEventListeners() {
        this.eventBus.on('taskDetailedView:checkListElementChangeName', ([checkListElement, checkListElementName]) => {
            if (checkListElement.isInitialized) {
                this.model.updateCheckListElement(checkListElement, checkListElementName);
            } else {
                this.model.createCheckListElement(checkListElement, checkListElementName);
            }
        });
        this.eventBus.on('taskDetailedView:checkListElementRemove', (checkListElement) => {
            if (checkListElement.isInitialized) {
                this.model.removeCheckListElement(checkListElement);
            }
        });
        this.eventBus.on('taskDetailedView:checkListElementUnchecked', (checkListElement) => {
            this.model.updateCheckListElement(checkListElement, undefined, false);
        });
        this.eventBus.on('taskDetailedView:checkListElementChecked', (checkListElement) => {
            this.model.updateCheckListElement(checkListElement, undefined, true);
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
        this.model.getAttachments();

        this.view.render(task);
        this.addEventListeners();

        this.initPopups();
        this.addTagEventListeners();
        this.addAttachmentsEventListeners();
        this.addCheckListsEventListeners();
        this.addCheckListsElementsEventListeners();
    }
}
