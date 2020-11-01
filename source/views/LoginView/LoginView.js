import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import './LoginView.tmpl.js';

/**
 * Class Login view.
 */
export default class LoginView extends BaseView {
    /**
     * LoginView view constructor.
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('loginForm')
            .addEventListener('submit', () => {
                this.eventBus.emit('loginView:formSubmit', null);
            }, false);
    }

    /**
     * setup template input data
     * @return {JSON} templateData
     */
    templateJSONSetup() {
        return {
            emailInput: {
                name: 'Электронная почта:',
                inputs: [
                    {
                        type: 'text',
                        id: 'email',
                        placeholder: 'mymailbox@mail.ru',
                        hasError: true,
                        params: [
                            {
                                name: 'autofocus',
                            },
                            {
                                name: 'autocomplete',
                                value: 'username',
                            },
                        ],
                    },
                ],
            },

            passwordInput: {
                name: 'Пароль:',
                inputs: [
                    {
                        type: 'password',
                        id: 'password',
                        placeholder: 'Введите пароль',
                        hasError: true,
                        params: [
                            {
                                name: 'autocomplete',
                                value: 'current-password',
                            },
                        ],
                    },
                ],
            },

            signInButton: {
                buttonText: 'Войти',
            },
        };
    }

    /**
     * Render Login view.
     */
    render() {
        Navbar.navbarHide();
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['views/LoginView/LoginView.tmpl'](templateInput);
        this.addEventListeners();
    }
}
