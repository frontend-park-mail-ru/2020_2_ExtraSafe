import BaseView from '../BaseView/BaseView.js';
// import Cookies from 'js-cookie';

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
        this.coocies = Cookies.get('tabutask_id');
        console.log(this.coocies)
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
     * Request to server
     */
    requestAuthorization() {
        let user = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        console.log(user.email, user.password);

        loginRequest(user).then((response) => {
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
     * Render Login view.
     */
    render() {
        const json = {
            emailInput: {
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
            },

            passwordInput: {
                name: 'Пароль:',
                inputs: [
                    {
                        type: 'password',
                        id: 'password',
                        placeholder: 'Введите пароль',
                        hasError: true,
                    },
                ],
            },

            signInButton: {
                buttonText: 'Войти',
            },
        };

        this.el.innerHTML = window.fest['views/LoginView/LoginView.tmpl'](json);
        document.getElementById("loginForm")
            .addEventListener("submit", this.requestAuthorization.bind(this), false);
    }
}
