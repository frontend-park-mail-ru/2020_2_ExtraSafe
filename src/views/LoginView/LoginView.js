import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import loginViewTemplate from './LoginView.tmpl.xml';
import Rendering from '../../utils/rendering.js';
import Validation from '../../utils/validation.js';

/**
 * Class Login view.
 */
export default class LoginView extends BaseView {
    /**
     * LoginView view constructor.
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        document.getElementById('loginForm')
            .addEventListener('submit', () => {
                if (Rendering.renderInputError('email', Validation.validateEmail()) &&
                    Rendering.renderInputError('password', Validation.validatePassword())) {
                    this.eventBus.emit('loginView:formSubmit', null);
                }
            }, false);
    }

    /**
     * setup template input data
     * @return {JSON} templateData
     */
    templateJSONSetup() {
        return {
            href: this.forwardUrl ? `/reg?forward=${this.forwardUrl}` : '/reg',
            emailInput: {
                name: 'Электронная почта:',
                inputs: [
                    {
                        type: 'text',
                        id: 'email',
                        placeholder: 'mymailbox@mail.ru',
                        hasError: true,
                        params: [
                            {
                                name: 'autofocus',
                            },
                            {
                                name: 'autocomplete',
                                value: 'username',
                            },
                        ],
                    },
                ],
            },

            passwordInput: {
                name: 'Пароль:',
                inputs: [
                    {
                        type: 'password',
                        id: 'password',
                        placeholder: 'Введите пароль',
                        hasError: true,
                        params: [
                            {
                                name: 'autocomplete',
                                value: 'current-password',
                            },
                        ],
                    },
                ],
            },

            signInButton: {
                buttonText: 'Войти',
            },
        };
    }

    /**
     * Render Login view.
     * @param {string} forwardUrl
     */
    render(forwardUrl) {
        this.forwardUrl = forwardUrl;
        Navbar.navbarHide();
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = loginViewTemplate(templateInput);
        this.addEventListeners();
    }
}
