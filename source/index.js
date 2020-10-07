import Router from './utils/router.js';
import LoginView from './views/LoginView/LoginView.js';
import RegView from './views/RegView/RegView.js';
import ProfileView from './views/ProfileView/ProfileView.js';
import AccountsView from './views/AccountsView/AccountsView.js';
import SecurityView from './views/SecurityView/SecurityView.js';
import HomeView from './views/HomeView/HomeView.js';

const app = document.getElementById('application');
const router = new Router(app);

const loginView = new LoginView(app, router, {});
const regView = new RegView(app, router, {});
const profileView = new ProfileView(app, router, {});
const accountsView = new AccountsView(app, router, {});
const securityView = new SecurityView(app, router, {});
const homeView = new HomeView(app, router, {});


router.addRoute('/login', loginView);
router.addRoute('/reg', regView);
router.addRoute('/profile', profileView);
router.addRoute('/accounts', accountsView);
router.addRoute('/security', securityView);
router.addRoute('/', homeView);


router.open(window.location.pathname);
