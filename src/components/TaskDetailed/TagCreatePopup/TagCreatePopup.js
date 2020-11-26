import tagCreatePopup from 'TagCreatePopup.tmpl.xml';
import rendering from '../../../utils/rendering.js';
import EventBus from '../../../utils/eventBus.js';

/**
 * TagCreatePopup class
 */
export default class TagCreatePopup {
    /**
     * TagAddPopup constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     */
    constructor(el) {
        this.el = el;
        this.eventBus = new EventBus();
    }

    /**
     * Hide popup
     */
    hide() {
        for (const el of this.el.children) {
            el.remove();
        }
        this.el.style.display = 'none';
    }

    /**
     * Add all event listeners
     * @param {Object} templateJSON
     */
    addEventListeners(templateJSON) {
        // TODO: изменить id
        for (let index = 0; index < templateJSON.colors.length; index++) {
            const colorEl = document.getElementById(`tagColor${index}`);
            colorEl.addEventListener('click', () => {
                if (colorEl.classList.contains('checked')) {
                    colorEl.classList.remove('checked');
                } else {
                    colorEl.classList.add('checked');
                }
            });
        }

        document.getElementById('close').addEventListener('click', () => {
            this.hide();
            this.eventBus.offAll();
        });
        document.getElementById('create').addEventListener('click', () => {
            this.hide();
            const tagName = document.getElementById('input').value;
            this.eventBus.emit('tagCreatePopup:tagCreate', tagName);
            this.eventBus.offAll();
        });

        window.onclick = (event) => {
            console.log('tagAddPopup:onClick');
            if (event.target !== this.el) {
                this.hide();
                this.eventBus.offAll();
            }
        };
    }

    /**
     * setup template input data
     * @return {Object} templateData
     */
    templateJSONSetup() {
        return {
            colors: [
                '#58FF1D',
                '#1B68FF',
                '#60FFB2',
                '#72E6FF',
                '#A88BFF',
                '#EF9213',
                '#FCFF27',
                '#FF5151',
                '#FF8080',
                '#FFE600',
            ],
        };
    }

    /**
     * Render popup
     */
    render() {
        const templateJSON = this.templateJSONSetup();
        const html = tagCreatePopup(templateJSON);
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.el.style.display = 'flex';
        this.addEventListeners(templateJSON);
    }
}
