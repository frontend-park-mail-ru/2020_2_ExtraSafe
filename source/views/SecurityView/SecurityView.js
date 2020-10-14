import BaseView from '../BaseView/BaseView.js';
import {rendering} from '../../utils/rendering.js';
import {validation} from '../../utils/validation.js';
import {network} from '../../utils/network.js';
import './SecurityView.tmpl.js';
import navbarPopup from '../../components/Navbar/Navbar.js';

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
        this.args = args;
    }

    /**
     * Check if user is authorized
     */
    ifAuthorized() {
        network.authRequest().then((response) => {
            if (response.ok) {
                this.render();
            } else {
                this.router.permOpen('/login');
            }
        });
    }

    /**
     * Set params to form
     * @param {object} data
     */
    setParams(data) {
        const avatarUrl = network.serverAddr + '/avatar/' + data.avatar;
        document.getElementById('avatarMini').src = avatarUrl;
    }

    /**
     * Get params from server
     * @return {Promise<void>}
     */
    async getParams() {
        try {
            const response = await network.profileGet();
            const profileData = await response.json();
            await this.setParams(profileData);
        } catch (err) {
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

        network.passwordSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.rendering.printServerErrors(responseBody.codes);
            } else {
                const passwordSuccess = document.getElementById('repeatPasswordError');
                passwordSuccess.className = 'changes-success';
                passwordSuccess.innerHTML = 'Пароль изменен';
                passwordSuccess.hidden = false;

                rendering.renderInputError('oldPassword', {result: true});

                document.getElementById('oldPassword').value = '';
                document.getElementById('password').value = '';
                document.getElementById('repeatPassword').value = '';
            }
            return responseBody;
        });
    }

    /**
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        let error = rendering.renderInputError('password', validation.validatePassword());
        error *= rendering.renderInputError('repeatPassword', validation.validateComparePasswords());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('password').addEventListener('focusout',
            () => {
                rendering.renderInputError('password', validation.validatePassword());
            }, false);

        document.getElementById('repeatPassword').addEventListener('focusout',
            () => {
                rendering.renderInputError('repeatPassword', validation.validateComparePasswords());
            }, false);


        document.getElementById('securityForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);

        document.getElementById('logout')
            .addEventListener('click', network.logout.bind(network), false);

        document.getElementById('avatarMini')
            .addEventListener('click', navbarPopup, false);
    }

    /**
     * setup template input data
     * @return {JSON} templateData
     */
    templateJSONSetup() {
        return {
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
                        hasError: true,
                    },
                    {
                        type: 'password',
                        id: 'password',
                        placeholder: 'Введите новый пароль',
                        hasError: true,
                    },
                    {
                        type: 'password',
                        id: 'repeatPassword',
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
    }

    /**
     * Render Security view.
     */
    render() {
        const templateInput = this.templateJSONSetup();

        this.el.innerHTML = window.fest['views/SecurityView/SecurityView.tmpl'](templateInput);
        this.addEventListeners();
        this.getParams();
    }
}
