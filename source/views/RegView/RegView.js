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
                        params: [
                            {
                                name: 'autofocus',
                            },
                            {
                                name: 'onfocusout',
                                value: 'updateError(\'email\', validateEmail)',
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
                                name: 'onfocusout',
                                value: 'updateError(\'username\', validateUsername)',
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
                                name: 'onfocusout',
                                value: 'updateError(\'password\', validatePassword)',
                            },
                        ],
                    },
                    {
                        type: 'password',
                        id: 'checkPassword',
                        placeholder: 'Повторите пароль',
                        hasError: true,
                        params: [
                            {
                                name: 'onfocusout',
                                value: 'updateError(\'checkPassword\', validateComparePasswords)',
                            },
                        ],
                    },
                ],
            },

            signUpButton: {
                buttonText: 'Зарегистрироваться',
            },
        };

        this.el.innerHTML = window.fest['views/RegView/RegView.tmpl'](json);
    }
}
