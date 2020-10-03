import BaseView from '../BaseView/BaseView.js';

/**
 * Class Security view.
 */
export default class SecurityView extends BaseView {
    /**
     * SecurityView view constructor.
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
     * Render Security view.
     */
    render() {
        const passwordInput = {
            name: 'Изменить пароль:',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
            inputs: [
                {
                    type: 'password',
                    id: 'oldPassword',
                    placeholder: 'Введите старый пароль',
                },
                {
                    type: 'password',
                    id: 'password',
                    placeholder: 'Введите новый пароль',
                    hasError: true,
                    params: [
                        {
                            name: 'onfocusout',
                            value: 'updateError(\'password\', validatePassword)',
                        },
                    ],
                },
                {
                    type: 'password',
                    id: 'checkPassword',
                    placeholder: 'Повторите новый пароль',
                    hasError: true,
                    params: [
                        {
                            name: 'onfocusout',
                            value: 'updateError(\'checkPassword\', validateComparePasswords)',
                        },
                    ],
                },
            ],
        };

        const submitButton = {
            buttonText: 'Применить изменения',
            params: [{
                name: 'style',
                value: 'width: 50%',
            }],
        };

        this.el.innerHTML = `<div class="default-container">
                <form id="form" class="profile-form" onsubmit="return false">
                    <div class="navigation"> 
                        <a class="profile-nav" href="/profile">Профиль</a>
                        <!--<div class="profile-nav">Внешний вид</div>--> 
                        <a class="profile-nav" href="/accounts">Аккаунты</a>
                        <div class="active-profile-nav">Безопасность</div>
                        <!--<a class="profile-nav">Уведомления</a>-->
                    </div>
                    
                    <div class="settings-body">
                        ${window.fest['components/NamedInput/NamedInput.tmpl'](passwordInput)}
                        ${window.fest['components/SubmitButton/SubmitButton.tmpl'](submitButton)}
<!--                        <div class="settings-input">-->
<!--                            Двухфакторная аутентификация-->
<!--                            <button class="main-settings-button"> Подключить </button>-->
<!--                        </div>-->
                    </div>
                </form>
             </div>`;
    }
}
