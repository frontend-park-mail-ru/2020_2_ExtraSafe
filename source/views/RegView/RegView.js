"use strict"

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
                <form class="reg-form" onsubmit="updateEmailError()">
                    <div>Регистрация аккаунта</div>
                    <div class="reg-input">
                        Электронная почта:
                        <input type="text" id="email" onfocusout="updateEmailError()" placeholder="mymailbox@mail.ru" autofocus>
                        <div id="emailError" class="reg-error" hidden="true"></div>
                    </div>
                    <div id="emailError" hidden="true"></div>
                    <div class="reg-input">
                        Полное имя:
                        <input type="text" id="fullName" placeholder="Имя Фамилия">
                    </div>
                    <div class="reg-input">
                        Пароль:
                        <input id="password" placeholder="Придумайте пароль">
                        <div id="passwordError" class="reg-error" hidden="true"></div>
                        <input id="checkPassword" onfocusout="updatePasswordError()" placeholder="Придумайте пароль">
                        <div id="compareError" class="reg-error" hidden="true"></div>
                    </div>
                    <div id="passwordError" hidden="true"></div>
                    <div id="compareError" hidden="true"></div>
                    <input class="reg-button" type="submit" value="Зарегистрироваться">
                    <a class="reg-a" href="/login">Уже есть аккаунт? Войти!</a>
                </form>
            </div>`;
    }
}