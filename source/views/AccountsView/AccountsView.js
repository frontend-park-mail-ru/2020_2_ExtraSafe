import BaseView from '../BaseView/BaseView.js';

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
                    console.log("ok");
                    this.render();
                }
                else {
                    this.router.permOpen('/login');
                }
            });
        }
        else {
            this.router.permOpen('/login');
        }
    }

    /**
     * Get params from server
     * @returns {Promise<void>}
     */
    async getParams() {
        try {
            let response = await accountsGet();
            let profileData = await response.json();
            console.log(profileData);
            await this.setParams(profileData);
        } catch (err) {
            alert(err);
        }
    }

    /**
     * Set params to form
     * @param data
     */

    setParams(data) {
        document.getElementById('telegram').value = data.telegram;
        document.getElementById('instagram').value = data.instagram;
        document.getElementById('github').value = data.github;
        document.getElementById('bitbucket').value = data.bitbucket;
        document.getElementById('vkontakte').value = data.vk;
        document.getElementById('facebook').value = data.facebook;
    }

    /**
     * Change user accounts
     */
    changeParams() {
        let data = {
            telegram: document.getElementById('telegram').value,
            instagram: document.getElementById('instagram').value,
            github: document.getElementById('github').value,
            bitbucket: document.getElementById('bitbucket').value,
            vk: document.getElementById('vkontakte').value,
            facebook: document.getElementById('facebook').value,
        };

        accountsSet(data).then((response) => {
            if (response.ok) {
                console.log("ok");
            }
            return response.json();
        }).then((responseBody) => {
            console.log(responseBody);
            this.setParams(responseBody);
            return responseBody;
        });
    }

    /**
     * Render Accounts view.
     */
    render() {
        const json = {
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

        this.el.innerHTML = window.fest['views/AccountsView/AccountsView.tmpl'](json);
        this.getParams();
    }
}