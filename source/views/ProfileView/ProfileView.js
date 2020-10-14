import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import Rendering from '../../utils/rendering.js';
import Validation from '../../utils/validation.js';
import Network from '../../utils/network.js';
import './ProfileView.tmpl.js';

const START_AVATAR_URL = 4;
const END_AVATAR_URL = 6;

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
            const response = await Network.profileGet();
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
        const avatarUrl = Network.serverAddr + '/avatar/' + data.avatar;
        document.getElementById('username').value = data.username;
        document.getElementById('fullName').value = data.fullName;
        document.getElementById('email').value = data.email;
        document.getElementById('profileAvatar').src = avatarUrl;
        Navbar.setAvatarURL(avatarUrl);
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
            avatar: document.getElementById('profileAvatar').src.split('/')
                .slice(START_AVATAR_URL, END_AVATAR_URL).join('/'),
        };

        formData.append('username', document.getElementById('username').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('fullName', document.getElementById('fullName').value);
        formData.append('avatar', document.getElementById('imageInput').files[0]);

        Network.profileSet(formData).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                Rendering.printServerErrors(responseBody.codes);
                this.setParams(data);
            } else {
                this.setParams(responseBody);
                const profileSuccess = document.getElementById('emailError');
                profileSuccess.className = 'changes-success';
                profileSuccess.innerHTML = 'Данные изменены';
                profileSuccess.hidden = false;
            }

            return responseBody;
        });
    }

    /**
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        const avatarError = Rendering.renderInputError('profileAvatar', Validation.validateAvatar());
        const usernameError = Rendering.renderInputError('username', Validation.validateUsername());
        const fullNameError = Rendering.renderInputError('fullName', Validation.validateFullName());
        const emailError = Rendering.renderInputError('email', Validation.validateEmail());
        return usernameError && fullNameError && emailError && avatarError;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('username').addEventListener('focusout',
            () => {
                Rendering.renderInputError('username', Validation.validateUsername());
            }, false);

        document.getElementById('fullName').addEventListener('focusout',
            () => {
                Rendering.renderInputError('fullName', Validation.validateFullName());
            }, false);

        document.getElementById('email').addEventListener('focusout',
            () => {
                Rendering.renderInputError('email', Validation.validateEmail());
            }, false);


        document.getElementById('profileForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);

        document.getElementById('imageInput')
            .addEventListener('change', Rendering.updateProfileImg.bind(Rendering), false);
    }

    /**
     * setup template input data
     * @return {JSON} templateData
     */
    templateJSONSetup() {
        return {
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
    }

    /**
     * Render Profile view.
     */
    render() {
        Navbar.navbarShow();
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['views/ProfileView/ProfileView.tmpl'](templateInput);
        this.getParams();
        this.addEventListeners();
    }
}
