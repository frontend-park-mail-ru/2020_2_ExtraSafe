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
        this.coocies = Cookies.get('tabutask_id');
    }

    /**
     * Check if user is authorized
     */
    ifAuthorized() {
        if (this.coocies !== undefined) {
            authRequest().then((response) => {
                if (response.ok) {
                    console.log("ok");
                    this.render();
                }
                else {
                    this.router.open('/login');
                }
                return response.json();
            }).then((responseBody) => {
                console.log(responseBody);
                return responseBody;
            });
        }
        else {
            this.router.open('/login');
        }
    }

    /**
     * Render Profile view.
     */
    render() {
        this.el.innerHTML = `<div class="default-container">
                <div id="form" class="profile-form" onsubmit="return false">
                    <div class="navigation"> 
                    <div class="first-profile-nav"> Профиль </div>
                    <!--<div class="profile-nav"> Внешний вид </div>--> 
                    <div class="profile-nav"> Аккаунты </div>
                    <div class="profile-nav"> Безопасность </div>
                    <div class="profile-nav"> Уведомления </div>
                </div>
               
                <div class="settings-body">
                
                  <div class="avatar"> </div>
                    <div class="settings-input-container">
                        <div class="settings-input">
                            Имя пользователя:
                            <input type="text" id="username">
                        </div>

                        <div class="settings-input">
                            Полное имя:
                            <input type="text" id="fullName">
                        </div>

                        <div class="settings-input">
                            Электронная почта:
                            <input type="text" id="email">
                        </div>
                    </div>
                    <div class="settings-input">
                        <button class="main-settings-button">Применить изменения</button>
                    </div>
                    
                </div>  
            </div>`;
    }
}


/* профиль
                    <div class="avatar"> </div>
                    <div class="settings-input-container">
                        <div class="settings-input">
                            Имя пользователя:
                            <input type="text" id="username">
                        </div>

                        <div class="settings-input">
                            Полное имя:
                            <input type="text" id="fullName">
                        </div>

                        <div class="settings-input">
                            Электронная почта:
                            <input type="text" id="email">
                        </div>
                    </div>
                    <div class="settings-input">
                        <button class="main-settings-button">Применить изменения</button>
                    </div>
*/

/* аккаунты
                    <div class="settings-input-with-img">
                        <img style="margin-right: 25px" src="../../img/account_logos/telegram.svg" width="37" height="37" alt="telegram">
                        <div class="settings-input">
                            Telegram:
                            <input type="text" id="telegram">
                        </div>
                    </div>

                    <div class="settings-input-with-img">
                        <img style="margin-right: 25px" src="../../img/account_logos/instagram.svg" width="37" height="37" alt="instagram">
                        <div class="settings-input">
                            Instagram:
                            <input type="text" id="instagram">
                        </div>
                    </div>

                    <div class="settings-input-with-img">
                        <img style="margin-right: 25px" src="../../img/account_logos/github.svg" width="37" height="37" alt="github">
                        <div class="settings-input">
                            GitHub:
                            <input type="text" id="github">
                        </div>
                    </div>

                    <div class="settings-input-with-img">
                        <img style="margin-right: 25px" src="../../img/account_logos/bitbucket.svg" width="37" height="37" alt="bitbucket">
                        <div class="settings-input">
                            Bitbucket:
                            <input type="text" id="bitbucket">
                        </div>
                    </div>

                    <div class="settings-input-with-img">
                        <img style="margin-right: 25px" src="../../img/account_logos/vkontakte.svg" width="37" height="37" alt="vkontakte">
                        <div class="settings-input">
                            Vkontakte:
                            <input type="text" id="vkontakte">
                        </div>
                    </div>

                    <div class="settings-input-with-img">
                        <img style="margin-right: 25px" src="../../img/account_logos/facebook.svg" width="37" height="37" alt="facebook">
                        <div class="settings-input">
                            Facebook:
                            <input type="text" id="facebook">
                        </div>
                    </div>
                    <div class="settings-input">
                        <button class="main-settings-button">Применить изменения</button>
                    </div>
*/

/* безопасность
                    <div class="settings-input">
                            Изменить пароль
                            <input type="text" id="oldPassword" placeholder="Старый пароль">
                            <input type="text" id="newPassword" placeholder="Новый пароль">
                            <input type="text" id="checkNewPassword" placeholder="Повторите новый пароль">
                            <button class="main-settings-button"> Применить изменения </button>
                    </div>

                    <div class="settings-input">
                            Двухфакторная аутентификация
                            <button class="main-settings-button"> Подключить </button>
                    </div>
*/

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
