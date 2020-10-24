import UserSession from './userSession.js';
import Network from './network.js';
import eventBus from './eventBus.js';

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
        this.isAuth = false;

        // When clicking on the link, correctly process
        this.catchMouseClick = this.catchMouseClick.bind(this);
        this.root.addEventListener('click', this.catchMouseClick);
        eventBus.on('network:logout', () => {
            this.isAuth = false;
            this.renderIfNotAuth('/login');
        }, 'Router');
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
                UserSession.setAccounts(responseBody);
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
            eventBus.emit('router:render', page);
            page.view.render();
        } else {
            const page = this.routesMap.get(route);
            eventBus.emit('router:render', page);
            page.view.render();
        }
    }

    /**
     * render if user is not authorised
     * @param {string} route
     */
    renderIfNotAuth(route) {
        if (route === '/login' || route === '/reg') {
            const page = this.routesMap.get(route);
            eventBus.emit('router:render', page);
            page.view.render();
        } else {
            window.history.replaceState({}, '', '/login');

            const page = this.routesMap.get('/login');
            eventBus.emit('router:render', page);
            page.view.render();
        }
    }

    /**
     * Open route
     * @param {string} route
     */
    open(route) {
        window.history.replaceState({}, '', route);

        if (this.routesMap.has(route)) {
            if (!this.isAuth) {
                this.authorize().then((response) => {
                    this.isAuth = response;
                    if (response === true) {
                        this.renderIfAuth(route);
                    } else {
                        this.renderIfNotAuth(route);
                    }
                });
            } else {
                this.renderIfAuth(route);
            }
        } else {
            window.history.replaceState({}, '', '/');

            const page = this.routesMap.get('/');
            eventBus.emit('router:render', page);
            page.view.render();
        }
    }

    /**
     * Catch click function
     * @param {object} event
     */
    catchMouseClick(event) {
        if (event.target instanceof HTMLAnchorElement) {
            event.preventDefault();
            const link = event.target;

            this.open(link.pathname);
        } else if (event.target instanceof HTMLImageElement) {
            const href = event.target.dataset.href;
            if (href !== undefined) {
                event.preventDefault();
                this.open(href);
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
        this.routesMap.set(route, handler);
    }
}
