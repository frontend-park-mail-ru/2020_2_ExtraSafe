import BaseController from '../../controllers/BaseController.js';
import TaskDetailedModel from './TaskDetailedModel.js';
import TaskDetailedView from './TaskDetailedView.js';
import TagAddPopup from './TagAddPopup/TagAddPopup.js';
import TagCreatePopup from './TagCreatePopup/TagCreatePopup.js';
import globalEventBus from '../../utils/globalEventBus.js';
import CheckListPopup from './CheckListPopup/CheckListPopup.js';
import TaskAssignersPopup from './TaskAssginersPopup/TaskAssignersPopup.js';

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

        const taskAssignersPopupEl = document.getElementById('taskAssignersPopup');
        this.taskAssignersPopup = new TaskAssignersPopup(taskAssignersPopupEl);
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
        this.eventBus.on('taskDetailedView:addAssigners', () => {
            this.taskAssignersPopup.render(this.model.board.boardMembers, this.model.task.taskAssigners);
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
     * Add event listeners related to check-lists
     */
    addCheckListsEventListeners() {
        this.checkListPopup.eventBus.on('checkListPopup:popupCreate', (checkListName) => {
            this.model.createCheckList(checkListName);
        });
        this.eventBus.on('taskDetailedView:removeCheckList', (checkList) => {
            this.model.removeCheckList(checkList);
        });
        this.eventBus.on('taskDetailedModel:createCheckListFailed', (codes) => {
            console.log('taskDetailedModel:createCheckListFailed', codes);
        });
        this.eventBus.on('taskDetailedModel:createCheckListSuccess', (responseBody) => {
            console.log('taskDetailedModel:createCheckListSuccess', responseBody);
            const newCheckList = this.model.addCheckList(responseBody);
            this.view.addCheckList(newCheckList);
        });
        this.eventBus.on('taskDetailedModel:removeCheckListFailed', (codes) => {
            console.log('taskDetailedModel:removeCheckListFailed', codes);
        });
        this.eventBus.on('taskDetailedModel:removeCheckListSuccess', (responseBody) => {
            console.log('taskDetailedModel:removeCheckListSuccess', responseBody);
        });
        this.eventBus.on('taskDetailedModel:updateCheckListFailed', (codes) => {
            console.log('taskDetailedModel:updateCheckListFailed', codes);
        });
        this.eventBus.on('taskDetailedModel:updateCheckListSuccess', (responseBody) => {
            console.log('taskDetailedModel:updateCheckListSuccess', responseBody);
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
     * Add event listeners related to assigners
     */
    addAssignersEventListeners() {
        this.taskAssignersPopup.eventBus.on('taskAssignersPopup:assignerAdded', (user) => {
            this.model.addAssigner(user);
            this.view.addAssigner(user);
        });
        this.taskAssignersPopup.eventBus.on('taskAssignersPopup:assignerRemoved', (user) => {
            this.model.removeAssigner(user);
            this.view.removeAssigner(user);
        });
        this.eventBus.on('taskDetailedModel:addAssignerFailed', (codes) => {
            console.log('taskDetailedModel:addAssignerFailed', codes);
        });
        this.eventBus.on('taskDetailedModel:addAssignerSuccess', (responseBody) => {
            console.log('taskDetailedModel:addAssignerSuccess', responseBody);
        });
        this.eventBus.on('taskDetailedModel:removeAssignerFailed', (codes) => {
            console.log('taskDetailedModel:removeAssignerFailed', codes);
        });
        this.eventBus.on('taskDetailedModel:removeAssignerSuccess', (responseBody) => {
            console.log('taskDetailedModel:removeAssignerSuccess', responseBody);
        });
    }

    /**
     * Add comments event listeners
     */
    addCommentsEventListeners() {
        this.eventBus.on('taskDetailedView:addComment', (text) => {
            this.model.createComment(text);
        });
        this.eventBus.on('taskDetailedView:removeComment', (comment) => {
            this.model.removeComment(comment);
        });
        this.eventBus.on('taskDetailedModel:createCommentFailed', (codes) => {
            console.log('taskDetailedModel:createCommentFailed', codes);
        });
        this.eventBus.on('taskDetailedModel:createCommentSuccess', (responseBody) => {
            console.log('taskDetailedModel:createCommentSuccess', responseBody);
            const newComment = this.model.addComment(responseBody);
            this.view.addComment(newComment);
        });
    }

    /**
     * Add event listeners related to web sockets
     */
    addWsEventListeners() {
        this.model.board.ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);

            if (data.body.cardID === this.model.card.cardID && data.body.taskID === this.model.task.taskID) {
                switch (data.method) {
                case 'ChangeTask':
                    this.view.updateDescription(data.body.taskDescription);
                    this.view.updateName(data.body.taskName);
                    break;
                case 'DeleteTask':
                    this.view.hide();
                    break;
                default:
                    break;
                }
            }
        });
    }

    /**
     * Render task detailed view
     * @param {Object} board
     * @param {Object} card
     * @param {Object} task
     */
    render(board, card, task) {
        this.model.task = task;
        this.model.card = card;
        this.model.board = board;

        this.view.render(task);
        this.addEventListeners();

        this.initPopups();
        this.addTagEventListeners();
        this.addAttachmentsEventListeners();
        this.addCheckListsEventListeners();
        this.addCheckListsElementsEventListeners();
        this.addAssignersEventListeners();
        this.addCommentsEventListeners();
        this.addWsEventListeners();
    }
}
