import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import Network from '../../utils/network.js';
import './CurrentBoard.tmpl.js';

/**
 * Class Current Desk view.
 */
export default class CurrentBoard extends BaseView {
    /**
     * CurrentBoardView constructor.
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
     * Render Current Board view.
     */
    render() {
        Navbar.navbarShow();
        this.el.innerHTML = window.fest['views/CurrentBoardView/CurrentBoard.tmpl']();
        // this.getParams();
    }
}
