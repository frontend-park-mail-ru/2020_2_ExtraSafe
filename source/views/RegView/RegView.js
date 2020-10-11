import BaseView from '../BaseView/BaseView.js';
import Rendering from '../../utils/rendering.js';
import Validation from '../../utils/validation.js';
import Network from '../../utils/network.js';
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
        this.el = el;
        this.args = args;
        this.rendering = new Rendering();
        this.validation = new Validation();
        this.network = new Network();
    }

    /**
     * Check if user is authorized
     */
    async ifAuthorized() {
        this.network.authRequest().then((response) => {
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

        this.network.regRequest(user).then((response) => {
            if (response.ok) {
                this.router.permOpen('/');
            }
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.printErrors(responseBody.messages);
            }
            return responseBody;
        });
    }

    /**
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        let error = this.rendering.renderInputError('email', this.validation.validateEmail());
        error *= this.rendering.renderInputError('username', this.validation.validateUsername());
        error *= this.rendering.renderInputError('password', this.validation.validatePassword());
        error *= this.rendering.renderInputError('repeatPassword', this.validation.validateComparePasswords());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('email').addEventListener('focusout',
            () => {
                this.rendering.renderInputError('email', this.validation.validateEmail());
            }, false);

        document.getElementById('username').addEventListener('focusout',
            () => {
                this.rendering.renderInputError('username', this.validation.validateUsername());
            }, false);

        document.getElementById('password').addEventListener('focusout',
            () => {
                this.rendering.renderInputError('password', this.validation.validatePassword());
            }, false);

        document.getElementById('repeatPassword').addEventListener('focusout',
            () => {
                this.rendering.renderInputError('repeatPassword', this.validation.validateComparePasswords());
            }, false);


        document.getElementById('regForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);
    }

    /**
     * print server error
     * @param {errorsArray} errors
     */
    printErrors(errors) {
        errors.forEach((element, i) => {
            const error = {
                result: false,
                message: element.message,
            };
            this.rendering.renderInputError(element.errorName, error);
        });
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
