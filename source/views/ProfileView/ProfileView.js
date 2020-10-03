import BaseView from '../BaseView/BaseView.js';

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
    }

    /**
     * Render Profile view.
     */
    render() {
        const usernameInput = {
            name: 'Имя пользователя:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'username',
                hasError: true,
            }],
        };

        const fullNameInput = {
            name: 'Полное имя:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'fullName',
                hasError: true,
            }],
        };

        const emailInput = {
            name: 'Электронная почта:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [{
                type: 'text',
                id: 'email',
                hasError: true,
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
                        <div class="active-profile-nav">Профиль</div>
                        <!--<div class="profile-nav">Внешний вид</div>--> 
                        <a class="profile-nav" href="/accounts">Аккаунты</a>
                        <a class="profile-nav" href="/security">Безопасность</a>
                        <!--<a class="profile-nav">Уведомления</a>-->
                    </div>
               
                    <form class="settings-body">
                        <img src="../../img/egor.jpg" class="avatar" alt="avatar">
                        <div class="settings-input-container">
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](usernameInput)}
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](fullNameInput)}
                            ${window.fest['components/NamedInput/NamedInput.tmpl'](emailInput)}
                        </div>
                        ${window.fest['components/SubmitButton/SubmitButton.tmpl'](submitButton)}
                    </form>
                </div>`;
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
