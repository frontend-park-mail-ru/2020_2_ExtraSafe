import BaseView from '../BaseView/BaseView.js';

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
    }

    /**
     * Render Login view.
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
                    placeholder: 'Введите пароль',
                    hasError: true,
                },
            ],
        };

        const signInButton = {buttonText: 'Войти'};

        this.el.innerHTML = `<div class="default-container">
                <form id="form" class="login-form" onsubmit="return false">
                    <div>Авторизация</div>
                    ${window.fest['components/NamedInput/NamedInput.tmpl'](emailInput)}
                    ${window.fest['components/NamedInput/NamedInput.tmpl'](passwordInput)}
                    ${window.fest['components/SubmitButton/SubmitButton.tmpl'](signInButton)}
                    <a class="login-reg-a" href="/reg">Ещё нет аккаунта? Зарегистрироваться!</a>
                </form>
            </div>`;
    }
}
