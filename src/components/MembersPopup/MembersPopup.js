import membersPopupTemplate from './MembersPopup.tmpl.xml';
import EventBus from '../../utils/eventBus.js';

/**
 * MembersPopup class
 */
export default class MembersPopup {
    /**
     * MembersPopup constructor.
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
     * @param {Object} board
     */
    addEventListeners(board) {
        document.getElementById('membersPopupClose').addEventListener('click', () => {
            this.hide();
        });
        document.getElementById('membersPopupInvite').addEventListener('click', () => {
            this.hide();
            this.eventBus.emit('membersPopup:memberInvite', null);
        });

        for (const member of board.boardMembers) {
            document.getElementById(member.memberDeleteID).addEventListener('click', () => {
                document.getElementById(member.memberHtmlID).remove();
                this.eventBus.emit('membersPopup:memberDelete', member);
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
     * Render popup
     * @param {Object} board
     */
    render(board) {
        this.el.style.display = 'flex';
        this.el.innerHTML = membersPopupTemplate(board);
        this.addEventListeners(board);
    }
}
