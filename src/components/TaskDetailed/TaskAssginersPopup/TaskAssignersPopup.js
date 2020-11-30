import taskAssignersPopupTemplate from './TaskAssignersPopup.tmpl.xml';
import EventBus from '../../../utils/eventBus.js';

/**
 * TaskAssignersPopup class
 */
export default class TaskAssignersPopup {
    /**
     * TaskAssignersPopup constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     */
    constructor(el) {
        this.el = el;
        this.eventBus = new EventBus();
    }

    /**
     * Hide popup
     */
    hide() {
        this.el.innerHTML = '';
        this.el.style.removeProperty('display');
    }

    /**
     * Add all event listeners
     * @param {[Object]} users
     */
    addEventListeners(users) {
        document.getElementById('taskAssignersPopupClose').addEventListener('click', () => {
            this.hide();
        });

        for (const user of users) {
            document.getElementById(user.memberTaskPopupHtmlID).addEventListener('click', (event) => {
                if (user.isSelected) {
                    document.getElementById(user.memberTaskPopupCheckID).style.removeProperty('display');
                    delete user.isSelected;
                    this.eventBus.emit('taskAssignersPopup:assignerRemoved', user);
                } else {
                    document.getElementById(user.memberTaskPopupCheckID).style.display = 'flex';
                    user.isSelected = true;
                    this.eventBus.emit('taskAssignersPopup:assignerAdded', user);
                }
            });
        }

        // document.addEventListener('click', (event) => {
        //     if (event.target !== this.el && event.target.id !== 'addTag') {
        //         this.hide();
        //     }
        // });

        // TODO: сделать нормальное закрытие
        // window.onclick = (event) => {
        //     console.log('tagAddPopup:onClick');
        //     if (event.target !== this.el) {
        //         this.hide();
        //         this.eventBus.offAll();
        //     }
        // };
    }

    /**
     * Create users array for template
     * @param {[Object]} boardMembers
     * @param {[Object]} taskAssigners
     * @return {[Object]}
     */
    createUsersForTemplate(boardMembers, taskAssigners) {
        const usersForTemplate = JSON.parse(JSON.stringify(boardMembers));
        if (Array.isArray(boardMembers) && boardMembers.length) {
            usersForTemplate.forEach((tmplUser) => {
                const userFound = taskAssigners.some((user) => {
                    return user.username === tmplUser.memberUsername;
                });
                if (userFound) {
                    tmplUser.isSelected = true;
                }
            });
        }
        return usersForTemplate;
    }

    /**
     * Render popup
     * @param {[Object]} boardMembers
     * @param {[Object]} taskAssigners
     */
    render(boardMembers, taskAssigners) {
        this.el.style.display = 'flex';

        const users = this.createUsersForTemplate(boardMembers, taskAssigners);
        this.el.innerHTML = taskAssignersPopupTemplate({users: users});
        this.addEventListeners(users);
    }
}
