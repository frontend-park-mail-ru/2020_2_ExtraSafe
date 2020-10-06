import BaseView from '../BaseView/BaseView.js';

/**
 * Class Home view.
 */
export default class HomeView extends BaseView {
    /**
     * LoginView view constructor.
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
     * Render Login view.
     */
    render() {
        this.el.innerHTML = window.fest['views/HomeView/HomeView.tmpl']();
        // document.getElementById('loginForm')
        //     .addEventListener('submit', this.requestAuthorization.bind(this), false);
    }
}
