import checkListPopupTemplate from './CheckListPopup.tmpl.xml';
import EventBus from '../../../utils/eventBus.js';

/**
 * CheckListPopup class
 */
export default class CheckListPopup {
    /**
     * CheckListPopup constructor.
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
        document.getElementById('checkListPopupClose').addEventListener('click', () => {
            this.hide();
        });
        document.getElementById('checkListPopupCreate').addEventListener('click', () => {
            const checkListName = document.getElementById('checkListPopupInput').value;
            this.hide();
            if (checkListName === '') {
                this.eventBus.emit('checkListPopup:popupCreate', 'Чек-лист');
            }
            this.eventBus.emit('checkListPopup:popupCreate', checkListName);
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

        this.el.innerHTML = checkListPopupTemplate();
        this.addEventListeners();
        document.getElementById('checkListPopupInput').focus();
    }
}
