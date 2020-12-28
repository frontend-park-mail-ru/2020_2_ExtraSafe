/**
 * Board template model
 */
export default class BoardTemplateModel {
    /**
     * Board template model constructor
     * @param {EventBus} eventBus
     * @param {string} templateSlug
     * @param {string} templateName
     * @param {string} templateDescription
     */
    constructor(eventBus, templateSlug, templateName, templateDescription) {
        this.eventBus = eventBus;
        this.board = {
            boardID: templateSlug,
            boardName: templateName,
            boardDescription: templateDescription,
            boardHtmlID: `template${templateSlug}`,
        };
    }
}
