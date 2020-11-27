import tagAddPopup from './TagAddPopup.tmpl.xml';
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
                    this.eventBus.emit('tagAddPopup:tagRemoved', tag);
                } else {
                    tagEl.classList.add('edit-tags__add__tag__selected');
                    tagCheckEl.style.display = 'flex';
                    this.eventBus.emit('tagAddPopup:tagAdded', tag);
                }
            });
            document.getElementById(tag.tagEditID).addEventListener('click', () => {
                this.hide();
                this.eventBus.emit('tagAddPopup:tagEdit', tag.tagID);
            });
        }

        document.getElementById('closeTagPopup').addEventListener('click', () => {
            this.hide();
        });
        document.getElementById('createTag').addEventListener('click', () => {
            this.hide();
            this.eventBus.emit('tagAddPopup:tagCreate', null);
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
     * Create tags array for template
     * @param {[Object]} taskTags
     * @param {[Object]} boardTags
     * @return {[Object]}
     */
    createTagsForTemplate(taskTags, boardTags) {
        const tagsForTemplate = JSON.parse(JSON.stringify(boardTags));
        tagsForTemplate.forEach((tmplTag) => {
            const tagFound = taskTags.some((tag) => {
                return tag.tagID === tmplTag.tagID;
            });
            if (tagFound) {
                tmplTag.isSelected = true;
            }
        });
        return tagsForTemplate;
    }

    /**
     * Render popup
     * @param {[Object]} tags
     * @param {[Object]} boardTags
     */
    render(tags, boardTags) {
        this.el.style.display = 'flex';

        const tagsForTemplate = this.createTagsForTemplate(tags, boardTags);

        this.el.innerHTML = tagAddPopup({tags: tagsForTemplate});
        this.addEventListeners(tagsForTemplate);
    }
}
