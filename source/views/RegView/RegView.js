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
    /* eslint-disable max-len */
    /**
     * Render Reg view.
     */
    render() {
        const emailInput = {
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
        };

        const usernameInput = {
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
        };

        const passwordInput = {
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
        };

        const signInButton = {buttonText: 'Зарегистрироваться'};

        this.el.innerHTML = `<div class="default-container">
                <form class="reg-form" onsubmit="updateAllErrors(); regRequest(); return false">
                    <div>Регистрация аккаунта</div>
                    ${window.fest['components/NamedInput/NamedInput.tmpl'](emailInput)}
                    ${window.fest['components/NamedInput/NamedInput.tmpl'](usernameInput)}
                    ${window.fest['components/NamedInput/NamedInput.tmpl'](passwordInput)}
                    ${window.fest['components/SubmitButton/SubmitButton.tmpl'](signInButton)}
                    <a class="login-reg-a" href="/login">Уже есть аккаунт? Войти!</a>
                </form>
            </div>`;
    }
    /* eslint-enable max-len */
}
