import memberInvitePopupTemplate from './MemberInvitePopup.tmpl.xml';
import EventBus from '../../utils/eventBus.js';

/**
 * MemberInvitePopup class
 */
export default class MemberInvitePopup {
    /**
     * MemberInvitePopup constructor.
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
     */
    addEventListeners() {
        document.getElementById('memberInvitePopupClose').addEventListener('click', () => {
            this.hide();
            this.eventBus.emit('memberInvitePopup:popupClose', null);
        });
        document.getElementById('memberInvitePopupAdd').addEventListener('click', () => {
            const memberUsername = document.getElementById('memberInvitePopupName').value;
            this.hide();
            this.eventBus.emit('memberInvitePopup:memberInvite', memberUsername);
        });

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
     */
    render() {
        this.el.style.display = 'flex';

        this.el.innerHTML = memberInvitePopupTemplate();
        this.addEventListeners();
        document.getElementById('memberInvitePopupName').focus();
    }
}
