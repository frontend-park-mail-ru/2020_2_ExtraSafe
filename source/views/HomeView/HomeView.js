import BaseView from '../BaseView/BaseView.js';
import Network from '../../utils/network.js';
import './HomeView.tmpl.js';
import navbarPopup from '../../components/Navbar/Navbar.js';

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

    /** Set params to form
     * @param {object} data
     */
    setParams(data) {
        const avatarUrl = this.network.serverAddr + 'avatar/' + data.avatar;
        document.getElementById('avatarMini').src = avatarUrl;
    }

    /**
     * Get params from server
     * @return {Promise<void>}
     */
    async getParams() {
        try {
            const response = await this.network.profileGet();
            const profileData = await response.json();
            await this.setParams(profileData);
        } catch (err) {
        }
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('logout')
            .addEventListener('click', this.network.logout.bind(this.network), false);

        document.getElementById('avatarMini')
            .addEventListener('click', navbarPopup, false);
    }

    /**
     * Render Login view.
     */
    render() {
        this.el.innerHTML = window.fest['views/HomeView/HomeView.tmpl']();
        this.addEventListeners();
        this.getParams();
    }
}
