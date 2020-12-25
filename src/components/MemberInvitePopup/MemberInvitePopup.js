import memberInvitePopupTemplate from './MemberInvitePopup.tmpl.xml';
import EventBus from '../../utils/eventBus.js';
import Rendering from '../../utils/rendering.js';

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
            const memberUsername = document.getElementById('memberInvitePopupName').innerText;
            this.eventBus.emit('memberInvitePopup:memberInvite', memberUsername);
        });

        this.eventBus.on('currentBoardController:inviteFailed', () => {
            Rendering.renderInputError('memberInvitePopupName',
                {result: false, message: 'Пользователь с таким именем не найден'});
        });
        this.eventBus.on('currentBoardController:inviteSuccess', () => {
            this.hide();
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
     * setup template input data
     * @param {string} sharedUrl
     * @return {JSON} templateData
     */
    templateJSONSetup(sharedUrl) {
        return {
            inviteUrlInput: {
                name: 'Пригласить с помощью ссылки',
                params: [
                    {
                        name: 'style',
                        value: 'width: 80%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        params: [
                            {
                                name: 'value',
                                value: sharedUrl,
                            },
                            {
                                name: 'readonly',
                                value: 'readonly',
                            },
                            {
                                name: 'onClick',
                                value: 'this.select();document.execCommand(\'copy\');',
                            },
                        ],
                    },
                ],
            },

            inviteUsernameInput: {
                name: 'Пригласить по имени пользователя',
                params: [
                    {
                        name: 'style',
                        value: 'width: 80%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'memberInvitePopupName',
                        placeholder: 'Введите имя пользователя',
                        hasError: true,
                        params: [
                            {
                                name: 'autofocus',
                            },
                        ],
                    },
                ],
            },
        };
    }

    /**
     * Render popup
     * @param {string} sharedUrl
     */
    render(sharedUrl) {
        this.el.style.display = 'flex';

        const data = this.templateJSONSetup(sharedUrl);
        this.el.innerHTML = memberInvitePopupTemplate(data);

        this.addEventListeners();
    }
}
