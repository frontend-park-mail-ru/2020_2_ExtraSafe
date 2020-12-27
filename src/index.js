import Router from './utils/router.js';
import LoginController from './controllers/LoginController.js';
import RegController from './controllers/RegController.js';
import SettingsController from './controllers/SettingsController.js';
import HomeController from './controllers/HomeController.js';
import InvitationHandler from './utils/invitationHandler.js';
import BoardRoutesHandler from './utils/boardRoutesHandler.js';
import rendering from './utils/rendering.js';

import './styles/scss/navbar.scss';
import './styles/scss/base.scss';
import './styles/scss/editTask.scss';
import './styles/scss/profile.scss';
import './styles/scss/login-reg.scss';
import './styles/scss/home.scss';
import './styles/scss/currentBoard.scss';

const appDiv = document.getElementById('application');
const contentDiv = document.getElementById('content');

const router = new Router(appDiv);

const loginController = new LoginController(contentDiv, router);
const regController = new RegController(contentDiv, router);
const homeController = new HomeController(contentDiv, router);
const settingsController = new SettingsController(contentDiv, router);
const invitationHandler = new InvitationHandler(router);
const boardRoutesHandler = new BoardRoutesHandler(contentDiv, router);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then((registration) => {
            console.log('sw registration on scope:', registration.scope);
        })
        .catch((err) => {
            console.error(err);
        });
}

if (!navigator.onLine) {
    console.log('offline');
    rendering.showOfflineMessage();
}

window.addEventListener('offline', () => {
    console.log('offline');
    rendering.showOfflineMessage();
});

router.addRoute(/^\/login$|^\/login\?forward=(.+)$/, loginController);
router.addRoute(/^\/reg$|^\/reg\?forward=(.+)$/, regController);
router.addRoute(/^\/settings$/, settingsController);
router.addRoute(/^\/$/, homeController);
router.addRoute(/^\/invite\/board\/(\d+)\/(\d+)$/, invitationHandler);
router.addRoute(/^\/board\/(\d+)$/, boardRoutesHandler);

console.log(window.location.pathname + window.location.search);
router.open(window.location.pathname + window.location.search);
