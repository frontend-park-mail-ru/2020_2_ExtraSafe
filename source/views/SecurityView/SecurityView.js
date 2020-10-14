import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import Rendering from '../../utils/rendering.js';
import Validation from '../../utils/validation.js';
import Network from '../../utils/network.js';
import './SecurityView.tmpl.js';

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
        Network.authRequest().then((response) => {
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
        const avatarUrl = Network.serverAddr + '/avatar/' + data.avatar;
        Navbar.setAvatarURL(avatarUrl);
    }

    /**
     * Get params from server
     * @return {Promise<void>}
     */
    async getParams() {
        try {
            const response = await Network.profileGet();
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

        Network.passwordSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.rendering.printServerErrors(responseBody.codes);
            } else {
                const passwordSuccess = document.getElementById('repeatPasswordError');
                passwordSuccess.className = 'changes-success';
                passwordSuccess.innerHTML = 'Пароль изменен';
                passwordSuccess.hidden = false;

                Rendering.renderInputError('oldPassword', {result: true});

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
        let error = Rendering.renderInputError('password', Validation.validatePassword());
        error *= Rendering.renderInputError('repeatPassword', Validation.validateComparePasswords());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('password').addEventListener('focusout',
            () => {
                Rendering.renderInputError('password', Validation.validatePassword());
            }, false);

        document.getElementById('repeatPassword').addEventListener('focusout',
            () => {
                Rendering.renderInputError('repeatPassword', Validation.validateComparePasswords());
            }, false);


        document.getElementById('securityForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);
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
        Navbar.navbarShow();
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['views/SecurityView/SecurityView.tmpl'](templateInput);
        this.addEventListeners();
        this.getParams();
    }
}
