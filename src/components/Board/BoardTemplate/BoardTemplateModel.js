/**
 * Board template model
 */
export default class BoardTemplateModel {
    /**
     * Board template model constructor
     * @param {EventBus} eventBus
     * @param {string} templateID
     * @param {string} templateName
     * @param {string} templateDescription
     */
    constructor(eventBus, templateID, templateName, templateDescription) {
        this.eventBus = eventBus;
        this.board = {
            boardID: templateID,
            boardName: templateName,
            boardDescription: templateDescription,
            boardHtmlID: `template${templateID}`,
        };
    }
}
