import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import Network from '../../utils/network.js';
import './AccountsView.tmpl.js';

/**
 * Class Accounts view.
 */
export default class AccountsView extends BaseView {
    /**
     * AccountsView view constructor.
     * @constructor
     * @param {object} el - Root application div.
     * @param {*} router
     * @param {*} args
     */
    constructor(el, router, args) {
        super(el, router, {});
        this.el = el;
        this.args = args;
    }

    /**
     * Get params from server
     * @return {Promise<void>}
     */
    async getParams() {
        try {
            const response = await Network.accountsGet();
            const profileData = await response.json();
            await this.setParams(profileData);
        } catch (err) {
        }
    }

    /**
     * Set params to form
     * @param {responseData} data
     */
    setParams(data) {
        const avatarUrl = Network.serverAddr + '/avatar/' + data.avatar;
        document.getElementById('telegram').value = data.telegram;
        document.getElementById('instagram').value = data.instagram;
        document.getElementById('github').value = data.github;
        document.getElementById('bitbucket').value = data.bitbucket;
        document.getElementById('vkontakte').value = data.vkontakte;
        document.getElementById('facebook').value = data.facebook;
        Navbar.setAvatarURL(avatarUrl);
    }

    /**
     * Change user accounts on server
     */
    changeParams() {
        const data = {
            telegram: document.getElementById('telegram').value,
            instagram: document.getElementById('instagram').value,
            github: document.getElementById('github').value,
            bitbucket: document.getElementById('bitbucket').value,
            vkontakte: document.getElementById('vkontakte').value,
            facebook: document.getElementById('facebook').value,
        };

        Network.accountsSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            this.setParams(responseBody);
            const accountsSuccess = document.getElementById('facebookError');
            accountsSuccess.className = 'changes-success';
            accountsSuccess.innerHTML = 'Данные изменены';
            accountsSuccess.hidden = false;
            return responseBody;
        });
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('accountsForm')
            .addEventListener('submit', this.changeParams.bind(this), false);
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
        Navbar.navbarShow();
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['views/AccountsView/AccountsView.tmpl'](templateInput);
        this.getParams();
        this.addEventListeners();
    }
}
