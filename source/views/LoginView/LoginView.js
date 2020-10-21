import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import eventBus from '../../utils/eventBus.js';
import './LoginView.tmpl.js';

/**
 * Class Login view.
 */
export default class LoginView extends BaseView {
    /**
     * LoginView view constructor.
     * @param {HTMLElement} el - Root application div.
     */
    constructor(el) {
        super(el);
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('loginForm')
            .addEventListener('submit', () => {
                eventBus.emit('loginView:formSubmit', null);
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
