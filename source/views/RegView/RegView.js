import BaseView from '../BaseView/BaseView.js';

/**
 * Class Reg view.
 */
export default class RegView extends BaseView {
    /**
     * RegView view constructor.
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
     * Render Reg view.
     */
    render() {
        this.el.innerHTML =
            `<div>Здесь будет регистрация</div>
        <div>Вернуться на <a href="/login">авторизацию</a></div>`;
    }
}