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
    }
}
