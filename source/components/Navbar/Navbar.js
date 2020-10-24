import UserSession from '../../utils/userSession.js';
import EventBus from '../../utils/eventBus.js';
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
        this.el.innerHTML = window.fest['components/Navbar/Navbar.tmpl']();
        this.setAvatarURL(UserSession.data.avatar);
        this.addEventListeners();
        this.navbarHide();
        EventBus.on('userSession:set', (input) => {
            this.setAvatarURL(input.avatar);
        }, 'Navbar');
    }

    /**
     * Show navbar
     */
    navbarShow() {
        this.el.hidden = false;
    }

    /**
     * Hide navbar
     */
    navbarHide() {
        this.el.hidden = true;
    }

    /**
     * Set avatar url
     * @param {string} avatarUrl
     */
    setAvatarURL(avatarUrl) {
        document.getElementById('avatarMini').src = avatarUrl;
    }

    /**
     * Show popup menu show
     */
    navbarPopupShow() {
        document.getElementById('myDropdown').classList.add('show');
    }

    /**
     * Show popup menu hide
     */
    navbarPopupHide() {
        document.getElementById('myDropdown').classList.remove('show');
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        document.getElementById('navbarLogout')
            .addEventListener('click', Network.logout.bind(Network), false);

        document.getElementById('avatarMini')
            .addEventListener('click', this.navbarPopupShow.bind(this), false);

        document.addEventListener('click', (event) => {
            if (event.target.id !== 'myDropdown' && event.target.id !== 'avatarMini') {
                this.navbarPopupHide();
            }
        }, false);
    }
}

export default new Navbar();
