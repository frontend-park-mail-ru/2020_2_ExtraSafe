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
                <form class="login-form" onsubmit="alert('submit!');return false">
                    <div>Авторизация</div>
                    <div class="login-input">
                        Электронная почта:
                        <input type="text" id="email" placeholder="mymailbox@mail.ru">
                    </div>
                    <div class="login-input">
                        Пароль:
                        <input type="text" id="password" placeholder="Введите пароль">
                    </div>
                    <input type="submit" class="login-button" value="Войти">
                    <a class="login-a" href="/reg">Ещё нет аккаунта? Зарегистрироваться!</a>
                </form>
            </div>`;
    }
}