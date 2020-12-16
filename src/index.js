import Router from './utils/router.js';
import LoginController from './controllers/LoginController.js';
import RegController from './controllers/RegController.js';
import SettingsController from './controllers/SettingsController.js';
import HomeController from './controllers/HomeController.js';
import CurrentBoardController from './controllers/CurrentBoardController.js';
import globalEventBus from './utils/globalEventBus.js';

import './styles/scss/navbar.scss';
import './styles/scss/base.scss';
import './styles/scss/editTask.scss';
import './styles/scss/test.scss';
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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', {scope: '/'})
        .then((registration) => {
            console.log('sw registration on scope:', registration.scope);
        })
        .catch((err) => {
            console.error(err);
        });
}

window.addEventListener('offline', () => {
    window.alert('offline');
});

router.addRoute('/login', loginController);
router.addRoute('/reg', regController);
router.addRoute('/settings', settingsController);
router.addRoute('/', homeController);

// TODO: переписать для перехода на публичные доски, которых нет в userSession
globalEventBus.on('userSession:setBoards', (boards) => {
    if (Array.isArray(boards) && boards.length) {
        for (const board of boards) {
            router.addRoute(`/board/${board.boardID}`,
                new CurrentBoardController(contentDiv, router, board.boardName, board.boardID));
        }
    }
});

router.open(window.location.pathname);
