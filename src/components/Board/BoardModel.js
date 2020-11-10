/**
 * Board model
 */
export default class BoardModel {
    /**
     * Board model constructor
     * @param {EventBus} eventBus
     * @param {number} boardNumber
     * @param {string} boardID
     * @param {string} boardName
     */
    constructor(eventBus, boardNumber, boardID, boardName) {
        this.eventBus = eventBus;
        this.board = {
            boardName: boardName,
            boardID: `board${boardNumber}`,
            removeBoardID: `removeBoard${boardNumber}`,
        };
        this.boardJSON = {
            boardID: boardID,
            name: boardName,
            theme: 'dark',
            star: false,
        };
    }
}
