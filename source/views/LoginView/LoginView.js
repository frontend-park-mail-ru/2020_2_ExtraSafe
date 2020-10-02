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
        // const container = document.createElement('div');
        // container.className = 'default-container';
        // this.el.appendChild(container);
        //
        // const form = document.createElement('form');
        // form.id = 'form';
        // form.className = 'login-form';
        // form.onsubmit = function() {
        //     return false;
        // };
        // form.innerHTML += window.fest['components/SubmitButton/SubmitButton.tmpl']({buttonText: 'Войти'});
        // container.appendChild(form);

        this.el.innerHTML = `<div class="default-container">
                <form id="form" class="login-form" onsubmit="return false">
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
                    ${window.fest['components/SubmitButton/SubmitButton.tmpl']({buttonText: 'Войти'})}
                    <a class="login-reg-a" href="/reg">Ещё нет аккаунта? Зарегистрироваться!</a>
                </form>
            </div>`;
    }
}
