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
     * Check if user is authorized
     */
    ifAuthorized() {
        const cookies = Cookies.get('tabutask_id');
        if (cookies !== undefined) {
            authRequest().then((response) => {
                if (response.ok) {
                    console.log('ok');
                    console.log('open profile profile')
                    this.render();
                }
                else {
                    console.log('open login profile')
                    this.router.permOpen('/login');
                }
            });
        }
        else {
            console.log('open login profile 2')
            this.router.permOpen('/login');
        }
    }

    /**
     * Get params from server
     * @return {Promise<void>}
     */
    async getParams() {
        try {
            const response = await profileGet();
            const profileData = await response.json();
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
        document.getElementById('username').value = data.nickname;
        document.getElementById('fullName').value = data.fullname;
        document.getElementById('email').value = data.email;
    }

    /**
     * Change user profile
     */
    changeParams() {
        const formData = new FormData();

        formData.append('username', document.getElementById('username').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('fullName', document.getElementById('fullName').value);
        formData.append('avatar', document.getElementById('imageInput').files[0]);

        profileSet(formData).then((response) => {
            if (response.ok) {
                console.log('ok');
            }
            return response.json();
        }).then((responseBody) => {
            console.log(responseBody);
            this.setParams(responseBody);
            return responseBody;
        });
    }

    /**
     * Render Profile view.
     */
    render() {
        // console.log(profileData.nickname);
        const json = {
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
                        params: [
                            {
                                name: 'onfocusout',
                                value: 'updateError(\'username\', validateUsername)',
                            },
                        ],
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
                        params: [
                            {
                                name: 'onfocusout',
                                value: 'updateError(\'fullName\', validateFullName)',
                            },
                        ],
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
                        params: [
                            {
                                name: 'onfocusout',
                                value: 'updateError(\'email\', validateEmail)',
                            },
                        ],
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

        this.el.innerHTML = window.fest['views/ProfileView/ProfileView.tmpl'](json);
        this.getParams();
        document.getElementById('profileForm')
            .addEventListener('submit', this.changeParams.bind(this), false);
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
