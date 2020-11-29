import BaseView from '../../views/BaseView/BaseView.js';
import Rendering from '../../utils/rendering.js';
import Validation from '../../utils/validation.js';
import securitySettingsViewTemplate from './SecuritySettingsView.tmpl.xml';

/**
 * Security settings view
 */
export default class SecuritySettingsView extends BaseView {
    /**
     * Security settings view constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        let error = Rendering.renderInputError('password', Validation.validatePassword());
        error &= Rendering.renderInputError('repeatPassword', Validation.validateComparePasswords());
        return error;
    }

    /**
     * show server error
     * @param {errorsDescription} error
     */
    showServerError(error) {
        Rendering.printServerErrors(error);
    }

    /**
     * Show server success
     */
    showServerSuccess() {
        const passwordSuccess = document.getElementById('repeatPasswordError');
        passwordSuccess.className = 'changes__success';
        passwordSuccess.innerHTML = 'Пароль изменен';
        passwordSuccess.hidden = false;

        Rendering.renderInputError('oldPassword', {result: true});

        document.getElementById('oldPassword').value = '';
        document.getElementById('password').value = '';
        document.getElementById('repeatPassword').value = '';
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


        document.getElementById('securityForm').addEventListener('submit', () => {
            if (this.updateAllErrors()) {
                this.eventBus.emit('securitySettingsView:formSubmit', null);
            }
        }, false);
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
        this.el.innerHTML = securitySettingsViewTemplate(templateInput);
        this.addEventListeners();
    }
}
