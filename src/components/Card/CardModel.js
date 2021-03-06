import network from '../../utils/network.js';

/**
 * Card model
 */
export default class CardModel {
    /**
     * Card model constructor
     * @param {EventBus} eventBus
     * @param {Object} board
     * @param {object} card
     */
    constructor(eventBus, board, card) {
        this.eventBus = eventBus;
        this.board = board;
        this.card = {
            cardID: card.cardID,
            cardName: card.cardName,
            cardHtmlID: `card${card.cardID}`,
            cardNameID: `cardName${card.cardID}`,
            cardSettingsID: `cardSettings${card.cardID}`,
            addTaskID: `addTask${card.cardID}`,
            tasksDiv: `tasksDiv${card.cardID}`,
            order: card.order,
            isInitialized: card.isInitialized,
        };
    }

    /**
     * Delete card on server
     */
    deleteCard() {
        network.cardDelete(this.card.cardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.deleteCard();
                    return;
                }
            }
        }).catch((error) => {
            return;
        });
    }

    /**
     * Send request to server with new card
     */
    createCardForServer() {
        const data = {
            boardID: this.board.boardID,
            cardName: this.card.cardName,
            cardOrder: this.card.order,
        };
        console.log(data);
        network.cardCreate(data, this.board.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.createCardForServer();
                    return;
                }
                this.eventBus.emit('cardModel:createCardFailed', responseBody.codes);
            } else {
                this.eventBus.emit('cardModel:createCardSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Send request to server with update card
     */
    updateCardForServer() {
        const data = {
            boardID: this.board.boardID,
            cardID: this.card.cardID,
            cardName: this.card.cardName,
            cardOrder: this.card.order,
        };
        network.cardSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.createCardForServer();
                    return;
                }
                this.eventBus.emit('cardModel:setCardFailed', responseBody.codes);
            } else {
                this.eventBus.emit('cardModel:setCardSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * Change task order on server
     * @param {[JSON]} tasks
     */
    changeTasksOrderOnServer(tasks) {
        const data = {
            cards: [
                {
                    cardID: this.card.cardID,
                    cardTasks: [],
                },
            ],
        };

        for (const task of tasks) {
            data.cards[0].cardTasks.push({
                taskID: task.model.task.taskID,
                taskOrder: task.model.task.order,
            });
        }

        network.tasksOrder(data, this.board.boardID).then((response) => {});
    }

    /**
     * Change multi card task order on server
     * @param {CardController} oldCard
     * @param {[JSON]} tasks
     */
    changeTaskMultiCardOrderOnServer(oldCard, tasks) {
        const data = {
            cards: [
                {
                    cardID: oldCard.model.card.cardID,
                    cardTasks: [],
                },
                {
                    cardID: this.card.cardID,
                    cardTasks: [],
                },
            ],
        };

        for (const task of oldCard.tasks) {
            data.cards[0].cardTasks.push({
                taskID: task.model.task.taskID,
                taskOrder: task.model.task.order,
            });
        }

        for (const task of tasks) {
            data.cards[1].cardTasks.push({
                taskID: task.model.task.taskID,
                taskOrder: task.model.task.order,
            });
        }

        network.tasksOrder(data, this.board.boardID).then((response) => {});
    }

    /**
     * Update card IDs data
     * @param {number} newCardID
     */
    updateCardIDs(newCardID) {
        this.card.cardID = newCardID;
        this.card.cardHtmlID = `card${newCardID}`;
        this.card.cardNameID = `cardName${newCardID}`;
        this.card.cardSettingsID = `cardSettings${newCardID}`;
        this.card.addTaskID = `addTask${newCardID}`;
        this.card.tasksDiv = `tasksDiv${newCardID}`;
    }
}
