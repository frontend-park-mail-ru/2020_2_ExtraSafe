import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import Network from '../../utils/network.js';
import './HomeView.tmpl.js';

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
        Network.authRequest().then((response) => {
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
        const avatarUrl = Network.serverAddr + '/avatar/' + data.avatar;
        Navbar.setAvatarURL(avatarUrl);
    }

    /**
     * Get params from server
     * @return {Promise<void>}
     */
    async getParams() {
        try {
            const response = await Network.profileGet();
            const profileData = await response.json();
            await this.setParams(profileData);
        } catch (err) {
        }
    }

    /**
<<<<<<< HEAD
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('logout')
            .addEventListener('click', network.logout.bind(network), false);

        document.getElementById('avatarMini')
            .addEventListener('click', navbarPopup, false);
    }

    /**
=======
>>>>>>> 4fb0aaa7e24d8a0239b4abdfea9738d812f6b86b
     * Render Login view.
     */
    render() {
        Navbar.navbarShow();
        this.el.innerHTML = window.fest['views/HomeView/HomeView.tmpl']();
        this.getParams();
    }
}
