import tagAddPopup from './TagAddPopup.tmpl.xml';
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
        this.el.innerHTML = '';
        this.el.style.removeProperty('display');
    }

    /**
     * Add all event listeners
     * @param {[Object]} tags
     */
    addEventListeners(tags) {
        // TODO: изменить id
        for (const tag of tags) {
            const tagEl = document.getElementById(tag.tagBodyHtmlID);
            const tagCheckEl = document.getElementById(tag.tagCheckID);
            tagEl.addEventListener('click', () => {
                if (tagEl.classList.contains('edit-tags__add__tag__selected')) {
                    tagEl.classList.remove('edit-tags__add__tag__selected');
                    tagCheckEl.style.removeProperty('display');
                    this.eventBus.emit('tagAddPopup:tagRemoved', tag.tagID);
                } else {
                    tagEl.classList.add('edit-tags__add__tag__selected');
                    tagCheckEl.style.display = 'flex';
                    this.eventBus.emit('tagAddPopup:tagAdded', tag.tagID);
                }
            });
            document.getElementById(tag.tagEditID).addEventListener('click', () => {
                this.hide();
                this.eventBus.emit('tagAddPopup:tagEdit', tag.tagID);
                this.eventBus.offAll();
            });
        }

        document.getElementById('closeTagPopup').addEventListener('click', () => {
            this.hide();
            this.eventBus.offAll();
        });
        document.getElementById('createTag').addEventListener('click', () => {
            this.hide();
            this.eventBus.emit('tagAddPopup:tagCreate', null);
            this.eventBus.offAll();
        });

        // TODO: сделать нормальное закрытие
        // window.onclick = (event) => {
        //     console.log('tagAddPopup:onClick');
        //     if (event.target !== this.el) {
        //         this.hide();
        //         this.eventBus.offAll();
        //     }
        // };
    }

    /**
     * setup template input data
     * @param {[Object]} tags
     * @return {Object} templateData
     */
    templateJSONSetup(tags) {
        for (const tag of tags) {
            tag.tagHtmlID = `tag${tag.tagID}`;
            tag.tagBodyHtmlID = `tagBody${tag.tagID}`;
            tag.tagCheckID = `tagCheck${tag.tagID}`;
            tag.tagEditID = `tagEditID${tag.tagID}`;
            tag.isSelected = true;
        }
        return {tags: tags};
    }

    /**
     * Render popup
     * @param {[Object]} tags
     */
    render(tags) {
        this.el.style.display = 'flex';
        const templateJSON = this.templateJSONSetup(tags);
        const html = tagAddPopup(templateJSON);
        this.el.appendChild(rendering.createElementsFromTmpl(html));
        this.addEventListeners(templateJSON.tags);
    }
}
