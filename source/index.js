import Router from './utils/router.js';
import LoginView from './views/LoginView/LoginView.js';
import RegView from './views/RegView/RegView.js';
import ProfileView from './views/ProfileView/ProfileView.js';
import AccountsView from './views/AccountsView/AccountsView.js';
import SecurityView from './views/SecurityView/SecurityView.js';
import HomeView from './views/HomeView/HomeView.js';

const app = document.getElementById('application');
const router = new Router(app);

const content = document.getElementById('content');

const loginView = new LoginView(content, router, {});
const regView = new RegView(content, router, {});
const profileView = new ProfileView(content, router, {});
const accountsView = new AccountsView(content, router, {});
const securityView = new SecurityView(content, router, {});
const homeView = new HomeView(content, router, {});


router.addRoute('/login', loginView);
router.addRoute('/reg', regView);
router.addRoute('/profile', profileView);
router.addRoute('/accounts', accountsView);
router.addRoute('/security', securityView);
router.addRoute('/', homeView);


router.open(window.location.pathname);
