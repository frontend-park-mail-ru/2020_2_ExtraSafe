import BaseView from '../../views/BaseView/BaseView.js';
import Rendering from '../../utils/rendering.js';
import Validation from '../../utils/validation.js';
import userSession from '../../utils/userSession.js';
import eventBus from '../../utils/eventBus.js';
import './ProfileSettingsView.tmpl.js';

/**
 * Profile settings view class
 */
export default class ProfileSettingsView extends BaseView {
    /**
     * Profile settings view constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     */
    constructor(el) {
        super(el);
    }

    /**
     * Set params to form
     * @param {object} data
     */
    setParams(data) {
        document.getElementById('username').value = data.username;
        document.getElementById('fullName').value = data.fullName;
        document.getElementById('email').value = data.email;
        document.getElementById('profileAvatar').src = data.avatar;
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
     * show server error
     * @param {errorsDescription} error
     */
    showServerError(error) {
        Rendering.printServerErrors(error);
    }

    /**
     * show server success
     */
    showServerSuccess() {
        const profileSuccess = document.getElementById('emailError');
        profileSuccess.className = 'changes-success';
        profileSuccess.innerHTML = 'Данные изменены';
        profileSuccess.hidden = false;
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


        document.getElementById('imageInput')
            .addEventListener('change', Rendering.updateProfileImg.bind(Rendering), false);

        document.getElementById('profileForm')
            .addEventListener('submit', () => {
                if (this.updateAllErrors()) {
                    eventBus.emit('profileSettingsView:formSubmit', null);
                }
            }, false);

        eventBus.on('userSession:set', (input) => {
            this.setParams(input);
        }, 'ProfileSettingsView');
        eventBus.on('router:render', (input) => {
            if (input !== this) {
                eventBus.offObject('ProfileSettingsView');
            }
        }, 'ProfileSettingsView');
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
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['components/ProfileSettings/ProfileSettingsView.tmpl'](templateInput);
        this.setParams(userSession.data);
        this.addEventListeners();
    }
}
