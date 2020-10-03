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
        const telegramInput = {
            name: 'Telegram:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'telegram',
            }],
        };

        const instagramInput = {
            name: 'Instagram:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'instagram',
            }],
        };

        const githubInput = {
            name: 'Github:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'github',
            }],
        };

        const bitbucketInput = {
            name: 'Bitbucket:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'bitbucket',
            }],
        };

        const vkontakteInput = {
            name: 'Vkontakte:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'vkontakte',
            }],
        };

        const facebookInput = {
            name: 'Facebook:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'facebook',
            }],
        };

        const submitButton = {
            buttonText: 'Применить изменения',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
        };

        this.el.innerHTML = `<div class="default-container">
                <div id="form" class="profile-form" onsubmit="return false">
                    <div class="navigation"> 
                        <a class="profile-nav" href="/profile">Профиль</a>
                        <!--<div class="profile-nav">Внешний вид</div>--> 
                        <div class="active-profile-nav">Аккаунты</div>
                        <a class="profile-nav" href="/security">Безопасность</a>
                        <!--<a class="profile-nav">Уведомления</a>-->
                    </div>
               
                    <form class="settings-body">
                        <div class="settings-input-with-img">
                            <img class="account-logo" src="../../img/account_logos/telegram.svg" alt="telegram">
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](telegramInput)}
                        </div>
                        <div class="settings-input-with-img">
                            <img class="account-logo" src="../../img/account_logos/instagram.svg" alt="instagram">
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](instagramInput)}
                        </div>
                        <div class="settings-input-with-img">
                            <img class="account-logo" src="../../img/account_logos/github.svg" alt="github">
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](githubInput)}
                        </div>
                        <div class="settings-input-with-img">
                            <img class="account-logo" src="../../img/account_logos/bitbucket.svg" alt="bitbucket">
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](bitbucketInput)}
                        </div>
                        <div class="settings-input-with-img">
                            <img class="account-logo" src="../../img/account_logos/vkontakte.svg" alt="vkontakte">
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](vkontakteInput)}
                        </div>
                        <div class="settings-input-with-img">
                            <img class="account-logo" src="../../img/account_logos/facebook.svg" alt="facebook">
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](facebookInput)}
                        </div>
                        ${window.fest['components/SubmitButton/SubmitButton.tmpl'](submitButton)}
                    </form>
                </div>`;
    }
}
