import BaseView from '../BaseView/BaseView.js';
import Rendering from '../../utils/rendering.js';
import Validation from '../../utils/validation.js';
import Navbar from '../../components/Navbar/Navbar.js';
import regViewTemplate from './RegView.tmpl.xml';

/**
 * Class Reg view.
 */
export default class RegView extends BaseView {
    /**
     * RegView view constructor.
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        let error = Rendering.renderInputError('email', Validation.validateEmail());
        error &= Rendering.renderInputError('username', Validation.validateUsername());
        error &= Rendering.renderInputError('password', Validation.validatePassword());
        error &= Rendering.renderInputError('repeatPassword', Validation.validateComparePasswords());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('email').addEventListener('focusout',
            () => {
                Rendering.renderInputError('email', Validation.validateEmail());
            }, false);

        document.getElementById('username').addEventListener('focusout',
            () => {
                Rendering.renderInputError('username', Validation.validateUsername());
            }, false);

        document.getElementById('password').addEventListener('focusout',
            () => {
                Rendering.renderInputError('password', Validation.validatePassword());
            }, false);

        document.getElementById('repeatPassword').addEventListener('focusout',
            () => {
                Rendering.renderInputError('repeatPassword', Validation.validateComparePasswords());
            }, false);


        document.getElementById('regForm')
            .addEventListener('submit', () => {
                if (this.updateAllErrors()) {
                    this.eventBus.emit('regView:formSubmit', null);
                }
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

            usernameInput: {
                name: 'Имя пользователя:',
                inputs: [
                    {
                        type: 'text',
                        id: 'username',
                        placeholder: 'Username',
                        hasError: true,
                        params: [
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
                        placeholder: 'Придумайте пароль',
                        hasError: true,
                        params: [
                            {
                                name: 'autocomplete',
                                value: 'new-password',
                            },
                        ],
                    },
                    {
                        type: 'password',
                        id: 'repeatPassword',
                        placeholder: 'Повторите пароль',
                        hasError: true,
                        params: [
                            {
                                name: 'autocomplete',
                                value: 'new-password',
                            },
                        ],
                    },
                ],
            },

            signUpButton: {
                buttonText: 'Зарегистрироваться',
            },
        };
    }

    /**
     * Render Reg view.
     */
    render() {
        Navbar.navbarHide();
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = regViewTemplate(templateInput);
        this.addEventListeners();
    }
}
