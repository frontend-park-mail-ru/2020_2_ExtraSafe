import network from './network.js';
import CurrentBoardController from '../controllers/CurrentBoardController.js';

/**
 * Board routes handler
 */
export default class BoardRoutesHandler {
    /**
     * Board routes handler constructor
     * @param {HTMLElement} el
     * @param {Router} router
     */
    constructor(el, router) {
        this.el = el;
        this.router = router;
    }

    /**
     * Add board
     * @param {string} boardID
     */
    render(boardID) {
        network.boardGet(boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.render(boardID);
                    return;
                }
                this.router.open('/');
            } else {
                const board = new CurrentBoardController(this.el, this.router, responseBody.boardName, boardID);
                board.render();
            }
            return responseBody;
        });
    }
}
