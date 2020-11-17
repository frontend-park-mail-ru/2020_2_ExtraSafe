import TaskController from '../Task/TaskController.js';
import network from '../../utils/network.js';

/**
 * Card model
 */
export default class CardModel {
    /**
     * Card model constructor
     * @param {EventBus} eventBus
     * @param {number} cardNumber
     * @param {object} card
     */
    constructor(eventBus, cardNumber, card) {
        this.eventBus = eventBus;
        this.card = {
            cardName: card.cardName,
            cardID: `card${cardNumber}`,
            cardNameID: `cardName${cardNumber}`,
            cardSettingsID: `cardSettings${cardNumber}`,
            addTaskID: `addTask${cardNumber}`,
            tasksDiv: `tasksDiv${cardNumber}`,
            tasks: [],
            isInitialized: card.isInitialized,
        };
        this.cardJSON = {
            boardID: card.boardID,
            cardID: card.cardID,
            name: card.cardName,
            order: undefined,
        };
        this.newTask = {
            boardID: card.boardID,
            taskID: '',
            cardID: card.cardID,
            taskName: '',
            taskDescription: '',
            contentEditable: 'true',
            isInitialized: false,
            order: 0,
        };
    }

    /**
     *
     * @param {[JSON]} tasksJSON
     */
    addTasksFromJSON(tasksJSON) {
        if (!(Array.isArray(tasksJSON) && tasksJSON.length)) {
            return;
        }

        tasksJSON.sort(function(a, b) {
            if (a.order < b.order) {
                return -1;
            } else {
                return 1;
            }
        });

        for (const task of tasksJSON) {
            const taskObj = {
                boardID: this.cardJSON.boardID,
                taskID: task.taskID,
                taskName: task.name,
                cardID: this.cardJSON.cardID,
                taskDescription: task.description,
                contentEditable: 'false',
                isInitialized: true,
                order: task.order,
            };
            this.addNewTask(this.tasksDiv, taskObj);
        }
    }

    /**
     * Update card name data
     * @param {string} newName
     */
    updateCardName(newName) {
        this.card.cardName = newName;
        if (this.card.isInitialized) {
            this.updateCardForServer();
        } else {
            this.createCardForServer();
        }
        this.card.isInitialized = true;
    }

    /**
     * delete card on server
     */
    deleteCard() {
        network.cardDelete(this.cardJSON.cardID).then((response) => {
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
     * Add new task data
     * @param {HTMLElement} tasksDiv
     * @param {object} task
     */
    addNewTask(tasksDiv, task = this.newTask) {
        const newTask = new TaskController(tasksDiv, this.card.tasks.length, task);
        this.card.tasks.push(newTask);
        ++this.newTask.order;

        this.eventBus.emit('cardModel:taskAdded', newTask);
    }

    /**
     * send request to server with new card
     */
    createCardForServer() {
        const data = {
            boardID: this.cardJSON.boardID,
            cardID: this.cardJSON.cardID,
            name: this.card.cardName,
        };
        network.cardCreate(data, this.cardJSON.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                if (!network.ifTokenValid(responseBody)) {
                    this.createCardForServer();
                    return;
                }
                this.eventBus.emit('cardModel:createCardFailed', responseBody.codes);
            } else {
                this.cardJSON.cardID = responseBody.cardID;
                this.eventBus.emit('cardModel:createCardSuccess', responseBody);
            }
            return responseBody;
        });
    }

    /**
     * send request to server with update card
     */
    updateCardForServer() {
        const data = {
            boardID: this.cardJSON.boardID,
            cardID: this.cardJSON.cardID,
            name: this.card.cardName,
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
     * Change task order inside one card
     * @param {HTMLElement} taskHTML
     */
    changeTaskOrder(taskHTML) {
        const oldElementIndex = Number.parseInt(taskHTML.dataset.order);
        const taskData = this.card.tasks[oldElementIndex];
        this.card.tasks.splice(oldElementIndex, 1);

        let newElementIndex = 0;
        for (const taskEl of document.getElementById(this.card.tasksDiv).children) {
            if (taskEl === taskHTML) {
                break;
            }
            ++newElementIndex;
        }
        this.card.tasks.splice(newElementIndex, 0, taskData);

        this.updateTaskOrder();
    }

    /**
     * Add task data to array
     * @param {HTMLElement} taskHTML
     * @param {JSON} taskData
     */
    addTask(taskHTML, taskData) {
        let newElementIndex = 0;
        for (const taskEl of document.getElementById(this.card.tasksDiv).children) {
            if (taskEl === taskHTML) {
                break;
            }
            ++newElementIndex;
        }
        this.card.tasks.splice(newElementIndex, 0, taskData);

        this.updateTaskOrder();
    }

    /**
     * Delete task from array
     * @param {HTMLElement} taskHTML
     */
    deleteTask(taskHTML) {
        this.card.tasks.splice(Number.parseInt(taskHTML.dataset.order), 1);

        this.updateTaskOrder();
    }

    /**
     * Update task order in HTML
     */
    updateTaskOrder() {
        let taskIndex = 0;
        for (const task of this.card.tasks) {
            task.model.task.order = taskIndex;
            task.model.taskJSON.order = taskIndex;
            document.getElementById(task.model.task.taskID).dataset.order = taskIndex.toString();
            ++taskIndex;
        }
    }

    /**
     * Change task order on server
     */
    changeTaskOrderOnServer() {
        const data = {
            cards: [
                {
                    cardID: this.cardJSON.cardID,
                    tasks: [],
                },
            ],
        };

        for (const task of this.card.tasks) {
            data.cards[0].tasks.push({
                taskID: task.model.taskJSON.taskID,
                order: task.model.taskJSON.order,
            });
        }

        network.tasksOrder(data, this.cardJSON.boardID).then((response) => {});
    }

    /**
     * Change multi card task order on server
     * @param {CardModel} oldCardModel
     */
    changeTaskMultiCardOrderOnServer(oldCardModel) {
        const data = {
            cards: [
                {
                    cardID: oldCardModel.cardJSON.cardID,
                    tasks: [],
                },
                {
                    cardID: this.cardJSON.cardID,
                    tasks: [],
                },
            ],
        };

        for (const task of oldCardModel.card.tasks) {
            data.cards[0].tasks.push({
                taskID: task.model.taskJSON.taskID,
                order: task.model.taskJSON.order,
            });
        }

        for (const task of this.card.tasks) {
            data.cards[1].tasks.push({
                taskID: task.model.taskJSON.taskID,
                order: task.model.taskJSON.order,
            });
        }

        network.tasksOrder(data, this.cardJSON.boardID).then((response) => {});
    }
}
