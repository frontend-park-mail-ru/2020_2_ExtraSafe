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
        this.el.innerHTML =
            `<div class="login-container">
                <div class="login-form">
                    <div>Авторизация</div>
                    <div class="login-input">
                        Электронная почта:
                        <input placeholder="mymailbox@mail.ru">
                    </div>
                    <div class="login-input">
                        Пароль:
                        <input placeholder="Введите пароль">
                    </div>
                    <button class="login-button">Войти</button>
                    <a class="login-a" href="/reg">Ещё нет аккаунта? Зарегистрироваться!</a>
                </div>
            </div>`;
    }
}