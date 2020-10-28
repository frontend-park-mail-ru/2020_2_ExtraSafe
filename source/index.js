import Router from './utils/router.js';
import LoginController from './controllers/LoginController.js';
import RegController from './controllers/RegController.js';
import SettingsController from './controllers/SettingsController.js';
import HomeController from './controllers/HomeController.js';
import CurrentBoardView from './views/CurrentBoardView/CurrentBoard.js';

const appDiv = document.getElementById('application');
const contentDiv = document.getElementById('content');

const router = new Router(appDiv);

const loginController = new LoginController(contentDiv, router);
const regController = new RegController(contentDiv, router);
const homeController = new HomeController(contentDiv, router);
const settingsController = new SettingsController(contentDiv, router);
const currentboardView = new CurrentBoardView(content, router, {});


router.addRoute('/login', loginController);
router.addRoute('/reg', regController);
router.addRoute('/settings', settingsController);
router.addRoute('/', homeController);
router.addRoute('/current', currentboardView);


router.open(window.location.pathname);
