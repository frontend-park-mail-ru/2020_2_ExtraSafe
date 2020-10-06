import BaseView from '../BaseView/BaseView.js';

/**
 * Class Security view.
 */
export default class SecurityView extends BaseView {
    /**
     * SecurityView view constructor.
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
        const cookies = Cookies.get('tabutask_id');
        if (cookies !== undefined) {
            authRequest().then((response) => {
                if (response.ok) {
                    console.log('ok');
                    this.render();
                } else {
                    this.router.permOpen('/login');
                }
            });
        } else {
            this.router.permOpen('/login');
        }
    }

    /**
     * Validate all fields and
     * send request to server
     */
    formSubmit() {
        if (this.updateAllErrors()) {
            this.changeParams();
        }
    }

    /**
     * Change user password
     */
    changeParams() {
        const data = {
            oldpassword: document.getElementById('oldPassword').value,
            password: document.getElementById('password').value,
        };

        passwordSet(data).then((response) => {
            if (response.ok) {
                console.log('ok');
            }
            return response.json();
        }).then((responseBody) => {
            console.log(responseBody);
            return responseBody;
        });
    }

    /**
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        let error = renderInputError('password', validatePassword());
        error *= renderInputError('repeatPassword', validateComparePasswords());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('password').addEventListener('focusout',
            function() {
                renderInputError('password', validatePassword());
            }, false);

        document.getElementById('repeatPassword').addEventListener('focusout',
            function() {
                renderInputError('repeatPassword', validateComparePasswords());
            }, false);


        document.getElementById('securityForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);
    }

    /**
     * Render Security view.
     */
    render() {
        const json = {
            passwordInput: {
                name: 'Изменить пароль:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'password',
                        id: 'oldPassword',
                        placeholder: 'Введите старый пароль',
                    },
                    {
                        type: 'password',
                        id: 'password',
                        placeholder: 'Введите новый пароль',
                        hasError: true,
                    },
                    {
                        type: 'password',
                        id: 'checkPassword',
                        placeholder: 'Повторите новый пароль',
                        hasError: true,
                    },
                ],
            },

            submitButton: {
                buttonText: 'Применить изменения',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
            },
        };

        this.el.innerHTML = window.fest['views/SecurityView/SecurityView.tmpl'](json);
        this.addEventListeners();
    }
}
