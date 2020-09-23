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
        this.el.innerHTML =
            `<div class="reg-container">
                <div class="reg-form">
                    <div>Регистрация аккаунта</div>
                    <div class="reg-input">
                        Электронная почта:
                        <input placeholder="mymailbox@mail.ru">
                    </div>
                    <div class="reg-input">
                        Полное имя:
                        <input placeholder="Имя Фамилия">
                    </div>
                    <div class="reg-input">
                        Пароль:
                        <input placeholder="Придумайте пароль">
                        <input placeholder="Придумайте пароль">
                    </div>
                    <button class="reg-button">Зарегистрироваться</button>
                    <a class="reg-a" href="/login">Уже есть аккаунт? Войти!</a>
                </div>
            </div>`;
    }
}