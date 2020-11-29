import EventBus from '../../utils/eventBus.js';
import rendering from '../../utils/rendering.js';
import addBoardPopupTemplate from './AddBoardPopup.tmpl.xml';

/**
 * AddBoardPopUp class
 */
export default class AddBoardPopup {
    /**
     * AddBoardPopUp constructor.
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
        for (const el of this.el.children) {
            el.remove();
        }
        this.el.style.display = 'none';
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        document.getElementById('createBoard').addEventListener('click', () => {
            const boardName = document.getElementById('popupBoardName').innerText;
            // TODO: сделать проверку на имя из пробелов
            if (boardName !== '') {
                this.eventBus.emit('addBoardPopup:addBoard', boardName);
            }
        });
        document.getElementById('closePopup').addEventListener('click', () => {
            this.hide();
        });
    }

    /**
     * Render popup
     */
    render() {
        const html = addBoardPopupTemplate();
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.el.style.display = 'flex';
        this.addEventListeners();
        document.getElementById('popupBoardName').focus();
    }
}
