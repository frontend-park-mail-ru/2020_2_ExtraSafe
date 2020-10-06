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

        // When clicking on the link, correctly process
        this.catchMouseClick = this.catchMouseClick.bind(this);
        this.root.addEventListener('click', this.catchMouseClick);
    }

    /**
     * Open route
     * @param {string} route
     */
    open(route) {
    // console.log(this.routesMap);

        window.history.replaceState({}, '', route);

        if (this.routesMap.has(route)) {
            this.routesMap.get(route).ifAuthorized();
        } else {
            alert('Такой страницы нет! Перенаправляю на авторизацию');
            this.open('/login');
        }
    }

    /**
     * Open route without permission check
     * @param {string} route
     */
    permOpen(route) {
        // console.log(this.routesMap);

        window.history.replaceState({}, '', route);

        if (this.routesMap.has(route)) {
            this.routesMap.get(route).render();
        } else {
            alert('Такой страницы нет! Перенаправляю на авторизацию');
            this.open('/login');
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
