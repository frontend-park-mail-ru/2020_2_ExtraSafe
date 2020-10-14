import Network from '../../utils/network.js';
import './Navbar.tmpl.js';

/**
 * Navbar
 */
class Navbar {
    /**
     * Navbar constructor
     */
    constructor() {
        this.el = document.getElementById('navbar');
    }

    /**
     * Show navbar
     */
    navbarShow() {
        this.el.innerHTML = window.fest['components/Navbar/Navbar.tmpl']();
        this.addEventListeners();
    }

    /**
     * Set avatar url
     * @param {string} avatarUrl
     */
    setAvatarURL(avatarUrl) {
        document.getElementById('avatarMini').src = avatarUrl;
    }

    /**
     * Show popup menu
     */
    navbarPopup() {
        document.getElementById('myDropdown').classList.toggle('show');
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        document.getElementById('logout')
            .addEventListener('click', Network.logout.bind(Network), false);

        document.getElementById('avatarMini')
            .addEventListener('click', this.navbarPopup.bind(this), false);
    }
}

export default new Navbar();
