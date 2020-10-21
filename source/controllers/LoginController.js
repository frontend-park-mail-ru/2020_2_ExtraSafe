import eventBus from '../utils/eventBus.js';
import LoginModel from '../models/LoginModel.js';
import LoginView from '../views/LoginView/LoginView.js';
import BaseController from './BaseController.js';
import Rendering from '../utils/rendering.js';

/**
 * Login controller
 * @typedef {Object} LoginController
 * @extends BaseController
 */
export default class LoginController extends BaseController {
    /**
     * Login controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        super(el, router);
        this.view = new LoginView(el);
        this.model = new LoginModel();

        eventBus.on('loginView:formSubmit', () => {
            this.model.requestAuthorization();
        });
        eventBus.on('loginModel:loginSuccess', () => {
            this.router.open('/');
        });
        eventBus.on('loginModel:loginFailed', (input) => {
            Rendering.printServerErrors(input);
        });
    }
}
