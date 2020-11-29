import UserSession from './userSession.js';
import Network from './network.js';
import globalEventBus from './globalEventBus.js';

/**
 * Router
 * @typedef {Object} Router
 */
export default class Router {
    /**
     * Router constructor
     * @constructor
     * @param {object} root
     */
    constructor(root) {
        this.root = root;
        this.routesMap = new Map();
        this.currentPage = undefined;
        this.isAuth = false;

        // When clicking on the link, correctly process
        this.catchMouseClick = this.catchMouseClick.bind(this);
        this.root.addEventListener('click', this.catchMouseClick);
        globalEventBus.on('network:logout', () => {
            this.isAuth = false;
            this.renderIfNotAuth('/login');
        });
    }

    /**
     * Check if user is authorized
     * @return {Promise<*>}
     */
    authorize() {
        return Network.authRequest().then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                return false;
            } else {
                UserSession.setData(responseBody);
                UserSession.setAccounts(responseBody.links);
                UserSession.setBoards(responseBody.boards);
                Network.setToken(responseBody.token);
                return true;
            }
        });
    }

    /**
     * render if user is authorised
     * @param {string} route
     */
    renderIfAuth(route) {
        if (route === '/login' || route === '/reg') {
            window.history.replaceState({}, '', '/');

            const page = this.routesMap.get('/');
            this.currentPage = '/';
            page.render();
        } else {
            const page = this.routesMap.get(route);
            this.currentPage = route;
            page.render();
        }
    }

    /**
     * render if user is not authorised
     * @param {string} route
     */
    renderIfNotAuth(route) {
        if (route === '/login' || route === '/reg') {
            const page = this.routesMap.get(route);
            this.currentPage = route;
            page.render();
        } else {
            window.history.replaceState({}, '', '/login');

            const page = this.routesMap.get('/login');
            this.currentPage = '/login';
            page.render();
        }
    }

    /**
     * Open route
     * @param {string} route
     */
    open(route) {
        window.history.replaceState({}, '', route);

        // TODO: переписать для перехода на публичные доски, которых нет в userSession
        if (!this.isAuth) {
            this.authorize().then((response) => {
                this.isAuth = response;
                if (this.routesMap.has(route)) {
                    if (response === true) {
                        this.renderIfAuth(route);
                    } else {
                        this.renderIfNotAuth(route);
                    }
                } else {
                    window.history.replaceState({}, '', '/');

                    const page = this.routesMap.get('/');
                    page.render();
                }
            });
        } else {
            this.renderIfAuth(route);
        }
    }

    /**
     * Catch click function
     * @param {object} event
     */
    catchMouseClick(event) {
        if (event.target instanceof HTMLAnchorElement) {
            event.preventDefault();

            const outHref = event.target.dataset.outhref;
            if (outHref !== undefined) {
                window.open(outHref, '_blank');
                return;
            }

            const link = event.target;
            this.open(link.pathname);
        } else if (event.target instanceof HTMLImageElement) {
            const href = event.target.dataset.href;
            if (href !== undefined) {
                event.preventDefault();
                this.open(href);
                return;
            }

            const outHref = event.target.dataset.outhref;
            if (outHref !== undefined) {
                event.preventDefault();
                window.open(outHref, '_blank');
            }
        }
    }

    /**
     * Add route function
     * @param {string} route
     * @param {BaseController} handler
     */
    addRoute(route, handler) {
    // handler is a callable function or method
        if (!this.routesMap.has(route)) {
            this.routesMap.set(route, handler);
        }
    }
}
