import BaseView from '../BaseView/BaseView.js';

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
    }

    /**
     * Check if user is authorized
     */
    async ifAuthorized() {
        const cookies = Cookies.get('tabutask_id');
        if (cookies !== undefined) {
            authRequest().then((response) => {
                if (response.ok) {
                    this.router.permOpen('/');
                } else {
                    this.render();
                }
            });
        } else {
            this.render();
        }
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
            nickname: document.getElementById('username').value,
            password: document.getElementById('password').value,
        };

        regRequest(user).then((response) => {
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
        let error = renderInputError('email', validateEmail());
        error *= renderInputError('username', validateUsername());
        error *= renderInputError('password', validatePassword());
        error *= renderInputError('repeatPassword', validateComparePasswords());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('email').addEventListener('focusout',
            function() {
                renderInputError('email', validateEmail());
            }, false);

        document.getElementById('username').addEventListener('focusout',
            function() {
                renderInputError('username', validateUsername());
            }, false);

        document.getElementById('password').addEventListener('focusout',
            function() {
                renderInputError('password', validatePassword());
            }, false);

        document.getElementById('repeatPassword').addEventListener('focusout',
            function() {
                renderInputError('repeatPassword', validateComparePasswords());
            }, false);


        document.getElementById('regForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);
    }

    printErrors(errors) {
        errors.forEach((element, i) => {
            const error = {
                result: false,
                message: element.message,
            };
            renderInputError(element.errorName, error);
        });
    }

    /**
     * Render Reg view.
     */
    render() {
        const json = {
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

        this.el.innerHTML = window.fest['views/RegView/RegView.tmpl'](json);
        this.addEventListeners();
    }
}
