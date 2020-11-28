import tagCreatePopup from './TagCreatePopup.tmpl.xml';
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
        this.el.innerHTML = '';
        this.el.style.display = 'none';
    }

    /**
     * Select tag
     * @param {Object} tag
     * @param {number} tagIndex
     */
    selectTag(tag, tagIndex) {
        const colorEl = document.getElementById(`tagColor${tagIndex}`);
        const checkEl = document.getElementById(`tagCheck${tagIndex}`);
        checkEl.style.display = 'flex';
        colorEl.classList.add('edit-tags__selected');
        tag.isSelected = true;
    }

    /**
     * Deselect tag
     * @param {Object} tag
     * @param {number} tagIndex
     */
    deselectTag(tag, tagIndex) {
        const colorEl = document.getElementById(`tagColor${tagIndex}`);
        const checkEl = document.getElementById(`tagCheck${tagIndex}`);
        checkEl.style.removeProperty('display');
        colorEl.classList.remove('edit-tags__selected');
        tag.isSelected = false;
    }

    // /**
    //  * Callback for click outside the element
    //  * @param {MouseEvent} event
    //  */
    // onClickOut(event) {
    //     if (event.target !== this.el && event.target.id !== 'createTag') {
    //         this.hide();
    //         this.eventBus.emit('tagCreatePopup:tagClose', null);
    //     }
    // }

    /**
     * Add all event listeners
     * @param {Object} templateJSON
     */
    addEventListeners(templateJSON) {
        // TODO: изменить id
        for (const [index, tag] of templateJSON.newTags.entries()) {
            document.getElementById(`tagColor${index}`).addEventListener('click', () => {
                if (tag.isSelected) {
                    this.deselectTag(tag, index);
                } else {
                    const lastCheckedIndex = templateJSON.newTags.findIndex((t) => {
                        return t.isSelected;
                    });
                    if (lastCheckedIndex !== -1) {
                        this.deselectTag(templateJSON.newTags[lastCheckedIndex], lastCheckedIndex);
                    }
                    this.selectTag(tag, index);
                }
            });
        }

        document.getElementById('closeTagPopup').addEventListener('click', () => {
            this.hide();
            this.eventBus.emit('tagCreatePopup:tagClose', null);
        });
        document.getElementById('createTag').addEventListener('click', () => {
            const tagColor = templateJSON.newTags.find((tag) => {
                return tag.isSelected;
            }).tagColor;
            const tagName = document.getElementById('tagName').value;
            this.hide();

            if (templateJSON.isInitialized) {
                templateJSON.tagColor = tagColor;
                templateJSON.tagName = tagName;
                delete templateJSON.newTags;
                delete templateJSON.isInitialized;
                this.eventBus.emit('tagCreatePopup:tagEdit', templateJSON);
            } else {
                this.eventBus.emit('tagCreatePopup:tagCreate', [tagName, tagColor]);
            }
        });

        // document.addEventListener('click', this.onClickOut.bind(this));

        // TODO: сделать нормальное закрытие
        // window.onclick = (event) => {
        //     console.log('tagAddPopup:onClick');
        //     if (event.target !== this.el) {
        //         this.hide();
        //     }
        // };
    }

    /**
     * Setup template input data
     * @return {Object} templateData
     */
    templateJSONSetup() {
        return {
            newTags: [
                {tagColor: '#58FF1D'},
                {tagColor: '#1B68FF'},
                {tagColor: '#60FFB2'},
                {tagColor: '#72E6FF'},
                {tagColor: '#A88BFF'},
                {tagColor: '#EF9213'},
                {tagColor: '#FCFF27'},
                {tagColor: '#FF5151'},
                {tagColor: '#FF8080'},
                {tagColor: '#FFE380'},
            ],
        };
    }

    /**
     * Render popup
     * @param {Object} tag
     */
    render(tag = undefined) {
        this.el.style.display = 'flex';
        const templateJSON = this.templateJSONSetup();
        if (tag) {
            const matchedTag = templateJSON.newTags.find((t) => {
                return t.tagColor === tag.tagColor;
            });
            matchedTag.isSelected = true;
            templateJSON.isInitialized = true;
            delete tag.tagColor;
            Object.assign(templateJSON, tag);
            templateJSON.titleText = 'Изменить метку';
            templateJSON.buttonText = 'Сохранить';
        } else {
            templateJSON.titleText = 'Создать метку';
            templateJSON.buttonText = 'Создать';
        }
        this.el.innerHTML = tagCreatePopup(templateJSON);
        this.addEventListeners(templateJSON);
        document.getElementById('tagName').select();
    }
}
