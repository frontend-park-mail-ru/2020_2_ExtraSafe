import BaseView from '../../views/BaseView/BaseView.js';
import './AccountsSettingsView.tmpl.js';
import userSession from '../../utils/userSession.js';

/**
 * Accounts settings view
 */
export default class AccountsSettingsView extends BaseView {
    /**
     * Accounts settings view constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * Set params to form
     * @param {responseData} data
     */
    setParams(data) {
        document.getElementById('telegram').value = data.telegram;
        document.getElementById('instagram').value = data.instagram;
        document.getElementById('github').value = data.github;
        document.getElementById('bitbucket').value = data.bitbucket;
        document.getElementById('vkontakte').value = data.vkontakte;
        document.getElementById('facebook').value = data.facebook;
    }

    /**
     * show server success
     */
    showServerSuccess() {
        const profileSuccess = document.getElementById('facebookError');
        profileSuccess.className = 'changes-success';
        profileSuccess.innerHTML = 'Данные изменены';
        profileSuccess.hidden = false;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('accountsForm').addEventListener('submit', () => {
            this.eventBus.emit('accountsSettingsView:formSubmit', null);
        }, false);
        this.eventBus.on('userSession:setAccounts', (input) => {
            this.setParams(input);
        });
    }

    /**
     * setup template input data
     * @return {JSON} templateData
     */
    templateJSONSetup() {
        return {
            telegramInput: {
                name: 'Telegram:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'telegram',
                    }],
            },

            instagramInput: {
                name: 'Instagram:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'instagram',
                    }],
            },

            githubInput: {
                name: 'Github:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'github',
                    }],
            },

            bitbucketInput: {
                name: 'Bitbucket:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'bitbucket',
                    }],
            },

            vkontakteInput: {
                name: 'Vkontakte:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'vkontakte',
                    }],
            },

            facebookInput: {
                name: 'Facebook:',
                params: [
                    {
                        name: 'style',
                        value: 'width: 50%',
                    }],
                inputs: [
                    {
                        type: 'text',
                        id: 'facebook',
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
     * Render Accounts view.
     */
    render() {
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['components/AccountsSettings/AccountsSettingsView.tmpl'](templateInput);
        this.setParams(userSession.accounts);
        this.addEventListeners();
    }
}
