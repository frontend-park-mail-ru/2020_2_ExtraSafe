import BaseView from '../BaseView/BaseView.js';
import Network from '../../utils/network.js';

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
        this.network = new Network();
    }

    /**
     * Check if user is authorized
     */
    ifAuthorized() {
        const cookies = Cookies.get('tabutask_id');
        if (cookies !== undefined) {
            this.network.authRequest().then((response) => {
                if (response.ok) {
                    this.render();
                } else {
                    this.router.permOpen('/login');
                }
            });
        } else {
            this.router.permOpen('/login');
        }
    }

    /**
     * Render Login view.
     */
    render() {
        this.el.innerHTML = window.fest['views/HomeView/HomeView.tmpl']();
        document.getElementById('logout')
            .addEventListener('click', this.network.logout.bind(this.network), false);
    }
}
