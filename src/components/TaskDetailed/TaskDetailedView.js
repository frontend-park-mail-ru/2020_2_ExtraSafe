import BaseView from '../../views/BaseView/BaseView.js';
import rendering from '../../utils/rendering.js';
import taskDetailedViewTemplate from './TaskDetailedView.tmpl.xml';
import tagDetailedTemplate from './TagDetailed.tmpl.xml';
import attachmentTemplate from './Attachment.tmpl.xml';
import checkListTemplate from './CheckList.tmpl.xml';
import checkListElementTemplate from './CheckListElement.tmpl.xml';
import taskAssignerTemplate from './TaskAssigner.tmpl.xml';
import commentTemplate from './Comment.tmpl.xml';
import userSession from '../../utils/userSession.js';

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
        this.hidden = true;
    }

    /**
     * Add tag view
     * @param {Object} tag
     */
    addTag(tag) {
        const tagEl = rendering.createElementsFromTmpl(tagDetailedTemplate(tag));
        document.getElementById('tagsDetailedDiv').appendChild(tagEl);
    }

    /**
     * Change tag view
     * @param {Object} tag
     */
    changeTag(tag) {
        document.getElementById(tag.tagDetailedID).style.background = tag.tagColor;
        document.getElementById(tag.tagDetailedNameID).innerText = tag.tagName;
    }

    /**
     * Remove tag view
     * @param {Object} tag
     */
    removeTag(tag) {
        document.getElementById(tag.tagDetailedID).remove();
    }

    /**
     * Add attachment view
     * @param {Object} fileObj
     */
    addAttachment(fileObj) {
        const uploadFileEl = document.getElementById('uploadFile');
        const attachmentEl = rendering.createElementsFromTmpl(attachmentTemplate(fileObj));
        document.getElementById('attachmentsDiv').insertBefore(attachmentEl, uploadFileEl);
        this.addAttachmentEventListeners(fileObj);
    }

    /**
     * Remove attachment view
     * @param {Object} fileObj
     */
    removeAttachment(fileObj) {
        document.getElementById(fileObj.fileHtmlID).remove();
    }

    /**
     * Add check-list view
     * @param {Object} checkListObj
     */
    addCheckList(checkListObj) {
        const addCheckListEl = document.getElementById('checkListCreate');
        const checkListEl = rendering.createElementsFromTmpl(checkListTemplate(checkListObj));
        console.log(document.getElementById('checkListsDiv'));
        console.log(checkListEl);
        document.getElementById('checkListsDiv').insertBefore(checkListEl, addCheckListEl);
        this.addCheckListEventListeners(checkListObj);
    }

    /**
     * Remove check-list view
     * @param {Object} checkListObj
     */
    removeCheckList(checkListObj) {
        document.getElementById(checkListObj.checkListHtmlID).remove();
    }

    /**
     * Add check-list element view
     * @param {Object} checkListObj
     */
    addCheckListElement(checkListObj) {
        const checkListAddNewElementEl = document.getElementById(checkListObj.checkListAddNewElementID);

        // TODO: костыль
        const checkListElementID = Math.floor(Math.random() * Math.floor(10000));
        const checkListElementObj = {
            checkListID: checkListObj.checkListID,
            checkListElementID: checkListElementID,
            checkListElementHtmlID: `checkList${checkListObj.checkListID}Element${checkListElementID}`,
            checkListElementCheckID: `checkList${checkListObj.checkListID}ElementCheck${checkListElementID}`,
            checkListElementNameID: `checkList${checkListObj.checkListID}ElementName${checkListElementID}`,
            isInitialized: false,
        };

        const checkListElementEl = rendering.createElementsFromTmpl(checkListElementTemplate(checkListElementObj));
        document.getElementById(checkListObj.checkListElementsDivID)
            .insertBefore(checkListElementEl, checkListAddNewElementEl);
        this.addCheckListElementEventListeners(checkListElementObj);
        document.getElementById(checkListElementObj.checkListElementNameID).focus();
    }

    /**
     * Remove check-list element view
     * @param {Object} checkListElementObj
     */
    removeCheckListElement(checkListElementObj) {
        document.getElementById(checkListElementObj.checkListElementHtmlID).remove();
        this.eventBus.emit('taskDetailedView:checkListElementRemove', checkListElementObj);
    }

    /**
     * Add assigner view
     * @param {Object} user
     */
    addAssigner(user) {
        const taskAssignerAddEl = document.getElementById('taskAssignersAdd');
        const taskAssignerEl = rendering.createElementsFromTmpl(taskAssignerTemplate(user));
        document.getElementById('taskAssignersDiv').insertBefore(taskAssignerEl, taskAssignerAddEl);
    }

    /**
     * Remove assigner view
     * @param {Object} user
     */
    removeAssigner(user) {
        document.getElementById(user.memberTaskHtmlID).remove();
    }

    /**
     * Add comment view
     * @param {Object} comment
     */
    addComment(comment) {
        const commentEl = rendering.createElementsFromTmpl(commentTemplate(comment));
        document.getElementById('commentsDiv').appendChild(commentEl);
        this.addCommentEventListeners(comment);
    }

    /**
     * On key down callback
     * @param {KeyboardEvent} event
     */
    onKeyDownBlur(event) {
        if (event.keyCode === 27) {
            if (document.activeElement !== document.body) {
                document.activeElement.blur();
            }
        }
    }

    /**
     * On key down callback
     * @param {KeyboardEvent} event
     */
    onKeyDownSubmit(event) {
        if (event.keyCode === 13) {
            document.activeElement.blur();
            // if (document.activeElement !== document.body) {
            //     document.activeElement.blur();
            // }
        }
    }

    /**
     * Update task name view
     * @param {string} name
     */
    updateName(name) {
        document.getElementById('taskName').innerText = name;
    }

    /**
     * Update task description view
     * @param {string} description
     */
    updateDescription(description) {
        document.getElementById('taskDescription').innerText = description;
    }

    // /**
    //  * On key down callback
    //  * @param {KeyboardEvent} event
    //  */
    // onKeyDownHide(event) {
    //     if (event.keyCode === 27) {
    //         console.log('taskView');
    //         if (document.activeElement !== document.body) {
    //             document.activeElement.blur();
    //         } else {
    //             this.hide();
    //         }
    //         // event.stopImmediatePropagation();
    //     }
    // }

    /**
     * Remove comment view
     * @param {Object} comment
     */
    deleteComment(comment) {
        document.getElementById(comment.commentHtmlID).remove();
    }

    /**
     * Update checklist
     * @param {Object} checkList
     */
    updateChecklist(checkList) {
        const checkListEl = document.getElementById(checkList.checkListHtmlID);
        document.getElementById('checkListsDiv')
            .replaceChild(rendering.createElementsFromTmpl(checkListTemplate(checkList)), checkListEl);
        this.addCheckListEventListeners(checkList);
    }

    /**
     * Hide view
     */
    hide() {
        this.el.innerHTML = '';
        this.el.style.display = 'none';
        // там прикол с bind(this)
        // window.removeEventListener('keydown', this.onKeyDownHide);
        window.removeEventListener('keydown', this.onKeyDownBlur);
        this.hidden = true;
        this.eventBus.emit('taskDetailedView:closed', null);
    }

    /**
     * Add all event listeners
     * @param {Object} task
     */
    addEventListeners(task) {
        // window.addEventListener('keydown', this.onKeyDownHide.bind(this));
        // globalEventBus.on('popupClosed', () => {
        //     this.el.addEventListener('keydown', this.onKeyDownHide.bind(this));
        // });
        window.addEventListener('keydown', this.onKeyDownBlur);
        document.getElementById('closeTask').addEventListener('click', () => {
            this.hide();
        });
        document.getElementById('taskDescription').addEventListener('focus', () => {
            document.getElementById('saveTaskDescription').style.display = 'flex';
        });
        document.getElementById('saveTaskDescription').addEventListener('mousedown', (event) => {
            const description = document.getElementById('taskDescription').innerText;
            this.eventBus.emit('taskDetailedView:updateTaskDescription', description);
            event.target.removeAttribute('style');
        });
        document.getElementById('taskName').addEventListener('focus', () => {
            window.addEventListener('keydown', this.onKeyDownSubmit);
        });
        document.getElementById('taskName').addEventListener('focusout', () => {
            window.removeEventListener('keydown', this.onKeyDownSubmit);
            const el = document.getElementById('taskName');
            const taskName = el.innerText;
            // TODO: сделать проверку на название из пробелов
            if (taskName === '') {
                el.innerHTML = task.taskName;
            } else {
                this.eventBus.emit('taskDetailedView:updateTaskName', taskName);
            }
        });
        document.getElementById('deleteTask').addEventListener('click', () => {
            this.el.style.display = 'none';
            this.eventBus.emit('taskDetailedView:deleteTask', null);
        });
        document.getElementById('addTag').addEventListener('click', () => {
            // window.removeEventListener('keydown', this.onKeyDownHide);
            this.eventBus.emit('taskDetailedView:addTag', null);
        });
        document.getElementById('checkListCreate').addEventListener('click', () => {
            // window.removeEventListener('keydown', this.onKeyDownHide.bind(this));
            this.eventBus.emit('taskDetailedView:addCheckList', null);
        });
        document.getElementById('taskAssignersAdd').addEventListener('click', () => {
            // window.removeEventListener('keydown', this.onKeyDownHide.bind(this));
            this.eventBus.emit('taskDetailedView:addAssigners', null);
        });

        document.getElementById('fileInput').addEventListener('change', (event) => {
            this.eventBus.emit('taskDetailedView:uploadFile', event.target.files[0]);
        });
        for (const attachment of task.attachments) {
            this.addAttachmentEventListeners(attachment);
        }

        for (const checkList of task.checkLists) {
            this.addCheckListEventListeners(checkList);
        }

        this.addCommentsEventListeners(task.comments);
    }

    /**
     * Add attachments event listeners
     * @param {Object} attachment
     */
    addAttachmentEventListeners(attachment) {
        document.getElementById(attachment.fileRemoveID).addEventListener('click', () => {
            this.removeAttachment(attachment);
            this.eventBus.emit('taskDetailedView:removeAttachment', attachment);
        });
    }

    /**
     * Add check-list event listeners
     * @param {Object} checkList
     */
    addCheckListEventListeners(checkList) {
        document.getElementById(checkList.checkListRemoveID).addEventListener('click', () => {
            this.removeCheckList(checkList);
            this.eventBus.emit('taskDetailedView:removeCheckList', checkList);
        });
        document.getElementById(checkList.checkListAddNewElementID).addEventListener('click', () => {
            this.addCheckListElement(checkList);
        });
        for (const checkListElement of checkList.checkListElements) {
            this.addCheckListElementEventListeners(checkListElement);
        }
    }

    /**
     * Add check-list event listeners
     * @param {Object} checkListElement
     */
    addCheckListElementEventListeners(checkListElement) {
        document.getElementById(checkListElement.checkListElementNameID).addEventListener('focusout', (event) => {
            if (event.target.innerText === '') {
                this.removeCheckListElement(checkListElement);
            } else {
                this.eventBus.emit('taskDetailedView:checkListElementChangeName',
                    [checkListElement, event.target.innerText]);
            }
        });
        document.getElementById(checkListElement.checkListElementCheckID).addEventListener('click', (event) => {
            if (checkListElement.isChecked) {
                event.target.src = '../../img/icons/box_unchecked.svg';
                this.eventBus.emit('taskDetailedView:checkListElementUnchecked', checkListElement);
            } else {
                event.target.src = '../../img/icons/check_grey.svg';
                this.eventBus.emit('taskDetailedView:checkListElementChecked', checkListElement);
            }
        });
    }

    /**
     * Add comments event listeners
     * @param {[Object]} comments
     */
    addCommentsEventListeners(comments) {
        const commentInput = document.getElementById('commentInputID');
        const commentSave = document.getElementById('commentSaveID');

        commentInput.addEventListener('focus', () => {
            commentSave.style.display = 'flex';
        });
        commentInput.addEventListener('focusout', () => {
            if (commentInput.innerText === '') {
                commentSave.style.display = 'none';
            }
        });
        commentSave.addEventListener('mousedown', () => {
            if (commentInput.innerText !== '') {
                this.eventBus.emit('taskDetailedView:addComment', commentInput.innerText);
                commentInput.innerHTML = '';
                commentSave.style.display = 'none';
            }
        });

        for (const comment of comments) {
            this.addCommentEventListeners(comment);
        }
    }

    /**
     * Add comment event listeners
     * @param {Object} comment
     */
    addCommentEventListeners(comment) {
        document.getElementById(comment.commentRemove).addEventListener('click', () => {
            document.getElementById(comment.commentHtmlID).remove();
            this.eventBus.emit('taskDetailedView:removeComment', comment);
        });
    }

    /**
     * Render task detailed view
     * @param {Object} task
     */
    render(task) {
        this.el.style.display = 'flex';
        task.commentAvatar = userSession.data.avatar;
        this.el.innerHTML = taskDetailedViewTemplate(task);
        this.addEventListeners(task);
        this.hidden = false;
    }
}
