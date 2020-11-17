import TaskController from '../Task/TaskController.js';
import network from '../../utils/network.js';

/**
 * Card model
 */
export default class CardModel {
    /**
     * Card model constructor
     * @param {EventBus} eventBus
     * @param {object} card
     */
    constructor(eventBus, card) {
        this.eventBus = eventBus;
        this.card = {
            cardName: card.cardName,
            cardID: `card${card.cardID}`,
            cardNameID: `cardName${card.cardID}`,
            cardSettingsID: `cardSettings${card.cardID}`,
            addTaskID: `addTask${card.cardID}`,
            tasksDiv: `tasksDiv${card.cardID}`,
            tasks: [],
            isInitialized: card.isInitialized,
            order: card.order,
        };
        this.cardJSON = {
            boardID: card.boardID,
            cardID: card.cardID,
            name: card.cardName,
            order: card.order,
        };
        this.newTask = {
            boardID: card.boardID,
            taskID: -1,
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
            this.card.isInitialized = true;
            this.createCardForServer();
        }
    }

    /**
     * delete card on server
     */
    deleteCard() {
        network.cardDelete(this.cardJSON.cardID);
    }

    /**
     * Add new task data
     * @param {HTMLElement} tasksDiv
     * @param {object} task
     */
    addNewTask(tasksDiv, task = this.newTask) {
        task.order = this.card.tasks.length;
        const newTask = new TaskController(tasksDiv, task);
        this.card.tasks.push(newTask);

        this.eventBus.emit('cardModel:taskAdded', newTask);
    }

    /**
     * send request to server with new card
     */
    createCardForServer() {
        const data = {
            boardID: this.cardJSON.boardID,
            name: this.card.cardName,
            order: this.card.order,
        };
        console.log(data);
        network.cardCreate(data, this.cardJSON.boardID).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
                this.eventBus.emit('cardModel:createCardFailed', responseBody.codes);
            } else {
                this.updateCardIDs(responseBody);
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
            order: this.card.order,
        };
        network.cardSet(data).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status > 200) {
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
        this.changeTaskOrderOnServer();
    }

    /**
     * Add task data to array
     * @param {HTMLElement} taskHTML
     * @param {TaskController} taskController
     */
    addTask(taskHTML, taskController) {
        let newElementIndex = 0;
        for (const taskEl of document.getElementById(this.card.tasksDiv).children) {
            if (taskEl === taskHTML) {
                break;
            }
            ++newElementIndex;
        }
        this.card.tasks.splice(newElementIndex, 0, taskController);

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
        for (const [taskIndex, task] of this.card.tasks.entries()) {
            task.model.task.order = taskIndex;
            task.model.taskJSON.order = taskIndex;
            document.getElementById(task.model.task.taskID).dataset.order = taskIndex.toString();
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

    /**
     * Delete task by it's ID
     * @param {string} taskID
     */
    deleteTaskByID(taskID) {
        for (const [taskIndex, task] of this.card.tasks.entries()) {
            if (task.model.task.taskID === taskID) {
                this.card.tasks.splice(taskIndex, 1);
            }
        }
        this.updateTaskOrder();
        this.changeTaskOrderOnServer();
    }

    /**
     * Update card IDs
     * @param {JSON} cardIDJson
     */
    updateCardIDs(cardIDJson) {
        const cardEl = document.getElementById(this.card.cardID);
        const cardNameIDEl = document.getElementById(this.card.cardNameID);
        const cardSettingsIDEl = document.getElementById(this.card.cardSettingsID);
        const addTaskIDEl = document.getElementById(this.card.addTaskID);
        const tasksDivEl = document.getElementById(this.card.tasksDiv);

        this.card.cardID = `card${cardIDJson.cardID}`;
        this.card.cardNameID = `cardName${cardIDJson.cardID}`;
        this.card.cardSettingsID = `cardSettings${cardIDJson.cardID}`;
        this.card.addTaskID = `addTask${cardIDJson.cardID}`;
        this.card.tasksDiv = `tasksDiv${cardIDJson.cardID}`;
        this.newTask.cardID = `card${cardIDJson.cardID}`;
        this.cardJSON.cardID = cardIDJson.cardID;

        cardEl.id = this.card.cardID;
        cardNameIDEl.id = this.card.cardNameID;
        cardSettingsIDEl.id = this.card.cardSettingsID;
        addTaskIDEl.id = this.card.addTaskID;
        tasksDivEl.id = this.card.tasksDiv;
    }
}
