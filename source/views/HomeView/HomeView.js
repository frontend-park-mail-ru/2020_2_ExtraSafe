import BaseView from '../BaseView/BaseView.js';
import {network} from '../../utils/network.js';
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
        this.args = args;
    }

    /**
     * Check if user is authorized
     */
    ifAuthorized() {
        network.authRequest().then((response) => {
            if (response.ok) {
                this.render();
            } else {
                this.router.permOpen('/login');
            }
        });
    }

    /** Set params to form
     * @param {object} data
     */
    setParams(data) {
        const avatarUrl = network.serverAddr + '/avatar/' + data.avatar;
        document.getElementById('avatarMini').src = avatarUrl;
    }

    /**
     * Get params from server
     * @return {Promise<void>}
     */
    async getParams() {
        try {
            const response = await network.profileGet();
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
            .addEventListener('click', network.logout.bind(network), false);

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
