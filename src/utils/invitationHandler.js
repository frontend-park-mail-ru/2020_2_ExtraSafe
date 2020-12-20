import network from './network.js';

/**
 * Invitation handler
 */
export default class InvitationHandler {
    /**
     * Invitation handler constructor
     * @param {Router} router
     */
    constructor(router) {
        this.router = router;
    }

    /**
     * Handle invitation
     * @param {string} boardID
     * @param {string} sharedUrl
     */
    render(boardID, sharedUrl) {
        console.log(boardID);
        console.log(sharedUrl);
        network.acceptInvitation(boardID, sharedUrl).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.render(boardID, sharedUrl);
                    return;
                }
            } else {
                this.router.open(`/board/${boardID}`);
            }
        }).catch((error) => {
            return;
        });
    }
}
