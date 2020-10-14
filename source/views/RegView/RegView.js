import BaseView from '../BaseView/BaseView.js';
import {rendering} from '../../utils/rendering.js';
import {validation} from '../../utils/validation.js';
import {network} from '../../utils/network.js';
import './RegView.tmpl.js';

/**
 * Class Reg view.
 */
export default class RegView extends BaseView {
    /**
     * RegView view constructor.
     * @constructor
     * @param {object} el - Root application div.
     * @param {*} router
     * @param {*} args
     */
    constructor(el, router, args) {
        super(el, router, {});
        this.args = args;
    }

    /**
     * Check if user is authorized
     */
    async ifAuthorized() {
        network.authRequest().then((response) => {
            if (response.ok) {
                this.router.permOpen('/');
            } else {
                this.render();
            }
        });
    }

    /**
     * Validate all fields and
     * send request to server
     */
    formSubmit() {
        if (this.updateAllErrors()) {
            this.registrationRequest();
        }
    }

    /**
     * Request to server
     */
    registrationRequest() {
        const user = {
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        };

        network.regRequest(user).then((response) => {
            if (response.ok) {
                this.router.permOpen('/');
            }
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                rendering.printServerErrors(responseBody.codes);
            }
            return responseBody;
        });
    }

    /**
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        let error = rendering.renderInputError('email', validation.validateEmail());
        error *= rendering.renderInputError('username', validation.validateUsername());
        error *= rendering.renderInputError('password', validation.validatePassword());
        error *= rendering.renderInputError('repeatPassword', validation.validateComparePasswords());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('email').addEventListener('focusout',
            () => {
                rendering.renderInputError('email', validation.validateEmail());
            }, false);

        document.getElementById('username').addEventListener('focusout',
            () => {
                rendering.renderInputError('username', validation.validateUsername());
            }, false);

        document.getElementById('password').addEventListener('focusout',
            () => {
                rendering.renderInputError('password', validation.validatePassword());
            }, false);

        document.getElementById('repeatPassword').addEventListener('focusout',
            () => {
                rendering.renderInputError('repeatPassword', validation.validateComparePasswords());
            }, false);


        document.getElementById('regForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);
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
                        params: [{name: 'autofocus'}],
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
                    },
                    {
                        type: 'password',
                        id: 'repeatPassword',
                        placeholder: 'Повторите пароль',
                        hasError: true,
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
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['views/RegView/RegView.tmpl'](templateInput);
        this.addEventListeners();
    }
}
