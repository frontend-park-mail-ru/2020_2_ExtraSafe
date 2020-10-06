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
                    console.log('open profile profile');
                    this.render();
                } else {
                    console.log('open login profile');
                    this.router.permOpen('/login');
                }
            });
        } else {
            console.log('open login profile 2');
            this.router.permOpen('/login');
        }
    }

    /**
     * Validate all fields and
     * send request to server
     */
    formSubmit() {
        if (this.updateAllErrors()) {
            this.changeParams();
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
     * @param {object} data
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
        const data = {
            email: document.getElementById('email').value,
            nickname: document.getElementById('username').value,
            fullname: document.getElementById('fullName').value,
        };

        profileSet(data).then((response) => {
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
     * render all error divs
     * @return {boolean} - error
     */
    updateAllErrors() {
        let error = renderInputError('username', validateUsername());
        error *= renderInputError('fullName', validateFullName());
        error *= renderInputError('email', validateEmail());
        return error;
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('username').addEventListener('focusout',
            function() {
                renderInputError('username', validateUsername());
            }, false);

        document.getElementById('fullName').addEventListener('focusout',
            function() {
                renderInputError('fullName', validateFullName());
            }, false);

        document.getElementById('email').addEventListener('focusout',
            function() {
                renderInputError('email', validateEmail());
            }, false);


        document.getElementById('profileForm')
            .addEventListener('submit', this.formSubmit.bind(this), false);
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
        this.addEventListeners();
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
