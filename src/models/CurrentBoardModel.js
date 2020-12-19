import network from '../utils/network.js';
import userSession from '../utils/userSession.js';

/**
 * Current board model
 */
export default class CurrentBoardModel {
    /**
     * Current board model constructor
     * @param {EventBus} eventBus
     * @param {string} boardName
     * @param {string} boardID
     */
    constructor(eventBus, boardName, boardID) {
        this.eventBus = eventBus;
        this.board = {
            boardID: boardID,
            boardName: boardName,
            boardMembers: [],
        };
    }

    /**
     * send request to server to get data of board
     * @return {Promise}
     */
    getBoardData() {
        return network.boardGet(this.board.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.getBoardData();
                    return;
                }
                this.eventBus.emit('currentBoardModel:getBoardFailed', responseBody.codes);
            } else {
                this.board.boardID = responseBody.boardID;
                this.board.boardName = responseBody.boardName;
                this.board.boardTags = responseBody.boardTags;
                this.board.boardMembers = responseBody.boardMembers;
                this.board.isAdmin = responseBody.boardAdmin.username === userSession.data.username;
                this.initTags();
                this.initMembers();
                // this.eventBus.emit('currentBoardModel:getBoardSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Initialize tags data
     */
    initTags() {
        if (Array.isArray(this.board.boardTags) && this.board.boardTags.length) {
            for (const tag of this.board.boardTags) {
                tag.tagDetailedID = `tagDetailed${tag.tagID}`;
                tag.tagDetailedNameID = `tagDetailedName${tag.tagID}`;
                tag.tagBodyHtmlID = `tagBody${tag.tagID}`;
                tag.tagCheckID = `tagCheck${tag.tagID}`;
                tag.tagEditID = `tagEditID${tag.tagID}`;
            }
        }
    }

    /**
     * Initialize members data
     */
    initMembers() {
        if (Array.isArray(this.board.boardMembers) && this.board.boardMembers.length) {
            for (const member of this.board.boardMembers) {
                member.memberHtmlID = `${member.username}Member`;
                member.memberDeleteID = `${member.username}MemberDelete`;
                member.memberTaskHtmlID = `${member.username}Task`;
                member.memberTaskPopupHtmlID = `${member.username}TaskPopup`;
                member.memberTaskPopupCheckID = `${member.username}TaskPopupCheck`;
                member.memberAvatarSrc = `${network.serverAddr}/avatar/${member.avatar}`;
                member.memberUsername = member.username;
            }
        }
    }

    /**
     * Update board name
     * @param {string} boardName
     */
    updateBoardName(boardName) {
        this.board.boardName = boardName;

        const data = {
            boardID: this.board.boardID,
            boardName: boardName,
        };
        network.boardSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.updateBoardName(boardName);
                    return;
                }
                this.eventBus.emit('currentBoardModel:boardSetFailed', responseBody.codes);
            } else {
                this.eventBus.emit('currentBoardModel:boardSetSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Delete board
     */
    deleteBoard() {
        network.boardDelete(this.board.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.deleteBoard();
                    return;
                }
            } else {
                this.eventBus.emit('currentBoardModel:boardDeleted', null);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Change card order on server
     * @param {[JSON]} cards
     */
    changeCardOrderOnServer(cards) {
        const data = {cards: cards};
        network.cardsOrder(data, this.board.boardID).then((response) => {});
    }

    /**
     * Delete member from board
     * @param {Object} member
     */
    memberExpel(member) {
        const data = {
            boardID: this.board.boardID,
            memberUsername: member.memberUsername,
        };

        console.log(data);

        network.userRemoveFromBoard(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.memberExpel(member);
                    return;
                }
                this.eventBus.emit('currentBoardModel:memberExpelFailed', responseBody.codes);
            } else {
                this.deleteMember(member.memberUsername);
                this.eventBus.emit('currentBoardModel:memberExpelSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Delete member from array
     * @param {string} username
     */
    deleteMember(username) {
        const index = this.board.boardMembers.findIndex((m) => {
            return m.username === username;
        });
        this.board.boardMembers.splice(index, 1);
    }

    /**
     * Invite member to board
     * @param {string} memberUsername
     */
    memberInvite(memberUsername) {
        const data = {
            boardID: this.board.boardID,
            memberUsername: memberUsername,
        };

        network.userAddToBoard(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.memberInvite(memberUsername);
                    return;
                }
                this.eventBus.emit('currentBoardModel:memberInviteFailed', responseBody.codes);
            } else {
                this.addMember(responseBody);
                this.eventBus.emit('currentBoardModel:memberInviteSuccess', responseBody);
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Add new member to array
     * @param {Object} memberData
     */
    addMember(memberData) {
        const newMember = {
            email: memberData.email,
            username: memberData.username,
            fullName: memberData.fullName,
            avatar: memberData.avatar,
        };
        this.board.boardMembers.push(newMember);
        this.initMembers();
    }
}
