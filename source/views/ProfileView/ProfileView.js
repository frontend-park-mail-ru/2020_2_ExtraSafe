import BaseView from '../BaseView/BaseView.js';
import Rendering from '../../utils/rendering.js';
import Validation from '../../utils/validation.js';
import Network from '../../utils/network.js';
import './ProfileView.tmpl.js';
import navbarPopup from '../../components/Navbar/Navbar.js';

/**
 * Class Profile view.
 */
export default class ProfileView extends BaseView {
    /**
     * ProfileView view constructor.
     * @constructor
     * @param {object} el - Root application div.
     * @param {*} router
     * @param {*} args
     */
    constructor(el, router, args) {
        super(el, router, {});
        this.el = el;
        this.args = args;
        this.rendering = new Rendering();
        this.validation = new Validation();
        this.network = new Network();
    }

    /**
     * Check if user is authorized
     */
    ifAuthorized() {
        const cookies = Cookies.get('tabutask_id');
        if (cookies !== undefined) {
            this.network.authRequest().then((response) => {
                if (response.ok) {
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
     * Get params from server
     * @return {Promise<void>}
     */
    async getParams() {
        try {
            const response = await this.network.profileGet();
            const profileData = await response.json();
            await this.setParams(profileData);
        } catch (err) {
        }
    }

    /**
     * Set params to form
     * @param {object} data
     */
    setParams(data) {
        document.getElementById('username').value = data.username;
        document.getElementById('fullName').value = data.fullName;
        document.getElementById('email').value = data.email;
    }

    /**
     * Change user profile
     */
    changeParams() {
        const formData = new FormData();

        const data = {
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            fullName: document.getElementById('fullName').value,
        };

        formData.append('username', document.getElementById('username').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('fullName', document.getElementById('fullName').value);
        formData.append('avatar', document.getElementById('imageInput').files[0]);

        this.network.profileSet(formData).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.printErrors(responseBody.messages);
            }
            this.setParams(data);
            return responseBody;
        });
    }

    /**
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        let error = this.rendering.renderInputError('username', this.validation.validateUsername());
        error *= this.rendering.renderInputError('fullName', this.validation.validateFullName());
        error *= this.rendering.renderInputError('email', this.validation.validateEmail());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('username').addEventListener('focusout',
            function() {
                this.rendering.renderInputError('username', this.validation.validateUsername());
            }.bind(this), false);

        document.getElementById('fullName').addEventListener('focusout',
            function() {
                this.rendering.renderInputError('fullName', this.validation.validateFullName());
            }.bind(this), false);

        document.getElementById('email').addEventListener('focusout',
            function() {
                this.rendering.renderInputError('email', this.validation.validateEmail());
            }.bind(this), false);


        document.getElementById('profileForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);

        document.getElementById('logout')
            .addEventListener('click', this.network.logout.bind(this.network), false);

        document.getElementById('avatarMini')
            .addEventListener('click', navbarPopup, false);
    }

    /**
     * print error
     * @param {errorObject} errors
     */
    printErrors(errors) {
        errors.forEach((element, i) => {
            const error = {
                result: false,
                message: element.message,
            };
            this.rendering.renderInputError(element.errorName, error);
        });
    }

    /**
     * Render Profile view.
     */
    render() {
        const json = {
            usernameInput: {
                name: 'Имя пользователя:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'username',
                        hasError: true,
                    }],
            },

            fullNameInput: {
                name: 'Полное имя:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'fullName',
                        hasError: true,
                    }],
            },

            emailInput: {
                name: 'Электронная почта:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'email',
                        hasError: true,
                    }],
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

        this.el.innerHTML = window.fest['views/ProfileView/ProfileView.tmpl'](json);
        this.getParams();
        this.addEventListeners();
    }
}

/* уведомления
                    <div class="buttons-notifications">
                        <div class="settings-input">
                                Уведомления по почте
                                <button class="main-settings-button"> Включить </button>
                        </div>

                        <div class="settings-input">
                                Уведомления в браузере
                                <button class="main-settings-button"> Включить </button>
                        </div>
                    </div>

                    <div> </div>

                    <div class="settings-input">
                        <div class="checkbox-settings">
                            <label style="margin: auto"> Уведомлять меня о моих дедлайнах </label>
                            <input style="margin: 10px" type="checkbox">
                        </div>

                        <div class="checkbox-settings">
                            <label style="margin: auto"> Уведомлять меня о моих новых задачах </label>
                            <input style="margin: 10px" type="checkbox">
                        </div>

                        <div class="checkbox-settings">
                            <label style="margin: auto"> Уведомлять меня о новых комментариях под моими задачами </label>
                            <input style="margin: 10px" type="checkbox">
                        </div>
                    </div>

                    <div class="settings-input">
                        <button class="main-settings-button"> Подтвердить изменения </button>
                    </div>
*/
