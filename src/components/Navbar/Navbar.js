import UserSession from '../../utils/userSession.js';
import Network from '../../utils/network.js';
import globalEventBus from '../../utils/globalEventBus.js';
import navbarTemplate from './Navbar.tmpl.xml';
import network from '../../utils/network.js';
import showNotification from '../NotificationPopup/NotificationPopup.js';

/**
 * Navbar
 */
class Navbar {
    /**
     * Navbar constructor
     */
    constructor() {
        this.el = document.getElementById('navbar');
        this.el.innerHTML = navbarTemplate();
        this.setAvatarURL(UserSession.data.avatar);
        this.addEventListeners();
        this.navbarHide();
        globalEventBus.on('userSession:set', (input) => {
            this.setAvatarURL(input.avatar);
        });

        this.addWsEventListeners();
    }

    /**
     * Show navbar
     */
    navbarShow() {
        this.el.hidden = false;
        this.ws = network.webSocketNotificationsConnection();
    }

    /**
     * Hide navbar
     */
    navbarHide() {
        this.el.hidden = true;
        delete this.ws;
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

    /**
     * Add event listeners related to web sockets
     */
    addWsEventListeners() {
        this.ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            switch (data.method) {
            case 'AddMemberNotification':
                showNotification(`${data.body.body.initiator} пригласил(а) Вас на доску ${data.body.body.boardName}`);
                break;
            case 'AssignUser':
                showNotification(`${data.body.body.initiator} назначил(а) Вас на задачу ${data.body.body.taskName}`);
                break;
            }
        });
    }
}

export default new Navbar();
