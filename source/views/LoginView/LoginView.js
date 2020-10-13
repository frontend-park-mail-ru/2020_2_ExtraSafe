import BaseView from '../BaseView/BaseView.js';
import Rendering from '../../utils/rendering.js';
import Network from '../../utils/network.js';
import './LoginView.tmpl.js';

/**
 * Class Login view.
 */
export default class LoginView extends BaseView {
    /**
     * LoginView view constructor.
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
        this.network = new Network();
    }

    /**
     * Check if user is authorized
     */
    ifAuthorized() {
        this.network.authRequest().then((response) => {
            if (response.ok) {
                this.router.permOpen('/');
            } else {
                this.render();
            }
        });
    }

    /**
     * Request to server
     */
    requestAuthorization() {
        const user = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };

        this.network.loginRequest(user).then((response) => {
            if (response.ok) {
                this.router.permOpen('/');
            }
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.rendering.printServerErrors(responseBody.codes);
            }
            return responseBody;
        });
    }

    /**
     * print error
     * @param {errors[]} errors
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
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('loginForm')
            .addEventListener('submit', this.requestAuthorization.bind(this), false);
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
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['views/LoginView/LoginView.tmpl'](templateInput);
        this.addEventListeners();
    }
}
