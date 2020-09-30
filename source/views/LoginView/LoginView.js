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
        this.el.innerHTML = `<div class="login-reg-container">
                <form id="form" class="login-form" onsubmit="authRequest(); return false">
                    <div>Авторизация</div>
                    <div class="login-reg-input">
                        Электронная почта:
                        <input type="text" id="email" placeholder="mymailbox@mail.ru" autofocus>
                        <div id="emailError" class="login-reg-error" hidden="true"></div>
                    </div>
                    <div class="login-reg-input">
                        Пароль:
                        <input type="password" id="password" placeholder="Введите пароль">
                        <div id="passwordError" class="login-reg-error" hidden="true"></div>
                    </div>
                    <button type="submit" class="login-reg-button">Войти</button>
                    <a class="login-reg-a" href="/reg">Ещё нет аккаунта? Зарегистрироваться!</a>
                </form>
            </div>`;
    }
}
