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
            this.open('/login');
        });

        window.onpopstate = (event) => {
            this.open(event.state, false);
        };
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
                UserSession.setBoards(responseBody.boards);
                Network.setToken(responseBody.token);
                return true;
            }
        });
    }

    /**
     * render if user is authorised
     * @param {string} route
     * @param {BaseController} handler
     * @param {[*]} args
     */
    renderIfAuth(route, handler, ...args) {
        if (route === '/login' || route === '/reg') {
            this.currentPage = '/';
            this.open('/');
        } else {
            this.currentPage = route;
            handler.render(...args);
        }
    }

    /**
     * render if user is not authorised
     * @param {string} route
     * @param {BaseController} handler
     * @param {[*]} args
     */
    renderIfNotAuth(route, handler, ...args) {
        if (/^\/login$|^\/login\?forward=(.+)$/.test(route) || /^\/reg$|^\/reg\?forward=(.+)$/.test(route)) {
            this.currentPage = route;
            handler.render(...args);
        } else {
            if (args.length === 2) {
                this.currentPage = `/login?forward=${route}`;
                this.open(`/login?forward=${route}`);
            } else {
                this.currentPage = '/login';
                this.open(`/login`);
            }
        }
    }

    /**
     * Open route
     * @param {string} route
     * @param {boolean} pushState
     */
    open(route, pushState = true) {
        for (const [regExp, controller] of this.routesMap.entries()) {
            if (regExp.test(route)) {
                const args = regExp.exec(route);
                args.shift();

                if (!this.isAuth) {
                    this.authorize().then((response) => {
                        this.isAuth = response;

                        if (response === true) {
                            this.renderIfAuth(route, controller, ...args);
                        } else {
                            this.renderIfNotAuth(route, controller, ...args);
                        }

                        if (pushState) {
                            window.history.pushState(this.currentPage,
                                `Tabutask ${this.currentPage.slice(1).replace('/', ' ')}`,
                                this.currentPage);
                        }
                    });
                } else {
                    this.renderIfAuth(route, controller, ...args);

                    if (pushState) {
                        window.history.pushState(this.currentPage,
                            `Tabutask ${this.currentPage.slice(1).replace('/', ' ')}`,
                            this.currentPage);
                    }
                }
                return;
            }
        }
        this.open('/');
    }

    /**
     * Catch click function
     * @param {object} event
     */
    catchMouseClick(event) {
        if (event.target instanceof HTMLAnchorElement) {
            event.preventDefault();

            const link = event.target;
            this.open(link.pathname + link.search);
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
     * @param {RegExp} route
     * @param {BaseController} handler
     */
    addRoute(route, handler) {
        if (!this.routesMap.has(route)) {
            this.routesMap.set(route, handler);
        }
    }
}
