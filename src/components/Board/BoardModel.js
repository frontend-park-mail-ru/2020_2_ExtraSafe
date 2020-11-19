/**
 * Board model
 */
export default class BoardModel {
    /**
     * Board model constructor
     * @param {EventBus} eventBus
     * @param {number} boardID
     * @param {string} boardName
     */
    constructor(eventBus, boardID, boardName) {
        this.eventBus = eventBus;
        this.board = {
            boardID: boardID,
            boardName: boardName,
            boardHtmlID: `board${boardID.toString()}`,
            removeBoardID: `removeBoard${boardID.toString()}`,
            theme: 'dark',
            star: false,
        };
        // this.boardJSON = {
        //     boardID: boardID,
        //     name: boardName,
        //     theme: 'dark',
        //     star: false,
        // };
    }
}
