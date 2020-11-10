import Router from './utils/router.js';
import LoginController from './controllers/LoginController.js';
import RegController from './controllers/RegController.js';
import SettingsController from './controllers/SettingsController.js';
import HomeController from './controllers/HomeController.js';
import CurrentBoardController from './controllers/CurrentBoardController.js';
import globalEventBus from './utils/globalEventBus.js';

import './styles/css/currentBoard.css';
import './styles/css/editTask.css';
import './styles/css/home.css';
import './styles/css/login-reg.css';
import './styles/css/main.css';
import './styles/css/navbar.css';
import './styles/css/profile.css';

const appDiv = document.getElementById('application');
const contentDiv = document.getElementById('content');

const router = new Router(appDiv);

const loginController = new LoginController(contentDiv, router);
const regController = new RegController(contentDiv, router);
const homeController = new HomeController(contentDiv, router);
const settingsController = new SettingsController(contentDiv, router);


router.addRoute('/login', loginController);
router.addRoute('/reg', regController);
router.addRoute('/settings', settingsController);
router.addRoute('/', homeController);

globalEventBus.on('userSession:setBoards', (boards) => {
    for (const board of boards) {
        router.addRoute(`/board/${board.boardID}`,
            new CurrentBoardController(contentDiv, router, board.name, board.boardID));
    }
});

router.open(window.location.pathname);
