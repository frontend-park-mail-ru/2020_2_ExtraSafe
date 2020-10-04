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
        this.coocies = Cookies.get('tabutask_id');
    }

    /**
     * Check if user is authorized
     */
    ifAuthorized() {
        if (this.coocies !== undefined) {
            authRequest().then((response) => {
                if (response.ok) {
                    console.log("ok");
                    this.router.open('/profile');
                }
                else {
                    this.render();
                }
                return response.json();
            }).then((responseBody) => {
                console.log(responseBody);
                return responseBody;
            });
        }
        else {
            this.render();
        }
    }

    /**
     * Validate all fields and
     * send request to server
     */
    formSubmit() {
        if (updateAllErrors()) {
            this.registrationRequest()
        }
    }

    /**
     * Request to server
     */
    registrationRequest() {
        let user = {
            email: document.getElementById('email').value,
            nickname: document.getElementById('username').value,
            password: document.getElementById('password').value,
        };

        console.log(user.email, user.password);

        regRequest(user).then((response) => {
            if (response.ok) {
                console.log("ok");
                this.router.open('/profile');
            }
            return response.json();
        }).then((responseBody) => {
            console.log(responseBody);
            return responseBody;
        });
    }

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
                <form id="regForm" class="reg-form" onsubmit="return false">
                    <div>Регистрация аккаунта</div>
                    ${window.fest['components/NamedInput/NamedInput.tmpl'](emailInput)}
                    ${window.fest['components/NamedInput/NamedInput.tmpl'](usernameInput)}
                    ${window.fest['components/NamedInput/NamedInput.tmpl'](passwordInput)}
                    ${window.fest['components/SubmitButton/SubmitButton.tmpl'](signInButton)}
                    <a class="login-reg-a" href="/login">Уже есть аккаунт? Войти!</a>
                </form>
            </div>`;

        document.getElementById("regForm")
            .addEventListener("submit", this.formSubmit.bind(this), false);
    }
}
