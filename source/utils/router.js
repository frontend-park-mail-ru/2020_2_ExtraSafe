import Network from './network.js';

/**
 * Router
 */
export default class Router {
    /**
     * Router constructor
     * @param {object} root
     */
    constructor(root) {
        this.root = root;
        this.routesMap = new Map();
        this.isAuth = false;

        // When clicking on the link, correctly process
        this.catchMouseClick = this.catchMouseClick.bind(this);
        this.root.addEventListener('click', this.catchMouseClick);
    }

    /**
     * Check if user is authorized
     * @return {Promise<*>}
     */
    ifAuthorized() {
        return Network.authRequest().then((response) => {
            console.log(response.ok);
            return response.ok;
        });
    }

    /**
     * render if user is authorised
     * @param {string} route
     */
    renderIfAuth(route) {
        if (route === '/login' || route === '/reg') {
            window.history.replaceState({}, '', '/');
            this.routesMap.get('/').render();
        } else {
            this.routesMap.get(route).render();
        }
    }

    /**
     * render if user is not authorised
     * @param {string} route
     */
    renderIfNotAuth(route) {
        if (route === '/login' || route === '/reg') {
            this.routesMap.get(route).render();
        } else {
            window.history.replaceState({}, '', '/login');
            this.routesMap.get('/login').render();
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
                this.ifAuthorized().then((response) => {
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
            window.history.replaceState({}, '', '/login');
            this.routesMap.get('/login').render();
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
     * @param {function} handler
     */
    addRoute(route, handler) {
    // handler is a callable function or method
        this.routesMap.set(route, handler);
    }
}
