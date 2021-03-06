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
        this.el.innerHTML = '';
        this.el.style.display = 'none';
        this.el.removeEventListener('keydown', this.onKeyDownSubmitBind);
        this.el.removeEventListener('keydown', this.onKeyDownHideBind);
    }

    /**
     * On key down callback
     * @param {KeyboardEvent} event
     */
    onKeyDownSubmit(event) {
        if (event.keyCode === 13) {
            const boardName = document.getElementById('popupBoardName').innerText;
            // TODO: сделать проверку на имя из пробелов
            if (boardName !== '') {
                this.eventBus.emit('addBoardPopup:addBoard', boardName);
            }
        }
    }

    /**
     * On key down callback
     * @param {KeyboardEvent} event
     */
    onKeyDownHide(event) {
        if (event.keyCode === 27) {
            this.hide();
        }
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.onKeyDownSubmitBind = this.onKeyDownSubmit.bind(this);
        this.onKeyDownHideBind = this.onKeyDownHide.bind(this);
        this.el.addEventListener('keydown', this.onKeyDownSubmitBind);
        this.el.addEventListener('keydown', this.onKeyDownHideBind);
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
        this.el.appendChild(rendering.createElementsFromTmpl(html));
        this.el.style.display = 'flex';
        this.addEventListeners();
        document.getElementById('popupBoardName').focus();
    }
}
