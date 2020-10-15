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

    /** Set params to form
     * @param {object} data
     */
    setParams(data) {
        // const avatarUrl = Network.serverAddr + '/avatar/' + data.avatar;
        // Navbar.setAvatarURL(avatarUrl);
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
     * Render Login view.
     */
    render() {
        Navbar.navbarShow();
        this.el.innerHTML = window.fest['views/HomeView/HomeView.tmpl']();
        // this.getParams();
    }
}
