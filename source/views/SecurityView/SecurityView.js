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
        const json = {
            passwordInput: {
                name: 'Изменить пароль:',
                params: [
                    {
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

        this.el.innerHTML = window.fest['views/SecurityView/SecurityView.tmpl'](json);
    }
}
