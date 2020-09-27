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
                <form class="reg-form" onsubmit="updateAllErrors(); return false">
                    <div>Регистрация аккаунта</div>
                    <div class="reg-input">
                        Электронная почта:
                        <input type="text" id="email" onfocusout="updateError('email', validateEmail)" placeholder="mymailbox@mail.ru" autofocus>
                        <div id="emailError" class="reg-error" hidden="true"></div>
                    </div>
                    <div id="emailError" hidden="true"></div>
                    <div class="reg-input">
                        Полное имя:
                        <input type="text" id="fullName" onfocusout="updateError('fullName', validateFullName)" placeholder="Имя Фамилия">
                        <div id="fullNameError" class="reg-error" hidden="true"></div>
                    </div>
                    <div class="reg-input">
                        Пароль:
                        <input type="password" id="password" onfocusout="updateError('password', validatePassword)" placeholder="Придумайте пароль">
                        <div id="passwordError" class="reg-error" hidden="true"></div>
                        <input type="password" id="checkPassword" onfocusout="updateError('checkPassword', validateComparePasswords)" placeholder="Придумайте пароль">
                        <div id="checkPasswordError" class="reg-error" hidden="true"></div>
                    </div>
                    <input class="reg-button" type="submit" value="Зарегистрироваться">
                    <a class="reg-a" href="/login">Уже есть аккаунт? Войти!</a>
                </form>
            </div>`;
    }
}