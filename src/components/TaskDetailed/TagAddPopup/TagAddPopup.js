import tagAddPopup from 'TagAddPopup.tmpl.xml';
import rendering from '../../../utils/rendering.js';
import EventBus from '../../../utils/eventBus.js';

/**
 * TagAddPopup class
 */
export default class TagAddPopup {
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
        this.el.style.removeProperty('display');
    }

    /**
     * Add all event listeners
     * @param {[Object]} tags
     */
    addEventListeners(tags) {
        // TODO: изменить id
        for (const tag of tags) {
            const tagEl = document.getElementById(tag.tagHtmlID);
            tagEl.addEventListener('click', () => {
                if (tagEl.classList.contains('checked')) {
                    tagEl.classList.remove('checked');
                    this.eventBus.emit('tagAddPopup:tagRemoved', tag.tagID);
                } else {
                    tagEl.classList.add('checked');
                    this.eventBus.emit('tagAddPopup:tagAdded', tag.tagID);
                }
            });
            document.getElementById(tag.tagEditID).addEventListener('click', () => {
                this.hide();
                this.eventBus.emit('tagAddPopup:tagEdit', tag.tagID);
                this.eventBus.offAll();
            });
        }

        document.getElementById('close').addEventListener('click', () => {
            this.hide();
            this.eventBus.offAll();
        });
        document.getElementById('create').addEventListener('click', () => {
            this.hide();
            this.eventBus.emit('tagAddPopup:tagCreate', null);
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
     * Render popup
     * @param {[Object]} tags
     */
    render(tags) {
        const html = tagAddPopup({tags: tags});
        this.el.appendChild(...rendering.createElementsFromTmpl(html));
        this.el.style.display = 'flex';
        this.addEventListeners(tags);
    }
}
