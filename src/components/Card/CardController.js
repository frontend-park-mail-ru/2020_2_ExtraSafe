import BaseController from '../../controllers/BaseController.js';
import CardView from './CardView.js';
import CardModel from './CardModel.js';
import globalEventBus from '../../utils/globalEventBus.js';
import TaskController from '../Task/TaskController.js';

/**
 * Card controller
 * @typedef {Object} CardController
 * @extends BaseController
 */
export default class CardController extends BaseController {
    /**
     * Card controller constructor
     * @constructor
     * @param {HTMLElement} el
     * @param {Object} board
     * @param {object} card
     */
    constructor(el, board, card) {
        super(el);
        this.view = new CardView(el, this.eventBus);
        this.model = new CardModel(this.eventBus, board, card);
        this.tasks = [];
    }

    /**
     * Add tasks from JSON
     * @param {[JSON]} tasks
     */
    addTasksFromJSON(tasks) {
        if (!(Array.isArray(tasks) && tasks.length)) {
            return;
        }

        tasks.sort(function(a, b) {
            if (a.order < b.order) {
                return -1;
            } else {
                return 1;
            }
        });

        for (const task of tasks) {
            // // TODO: убрать заглушку
            // const tags = [
            //     {
            //         tagID: 0,
            //         tagName: 'front',
            //         tagColor: '#FFE380',
            //     },
            //     {
            //         tagID: 1,
            //         tagName: 'back',
            //         tagColor: '#FF8080',
            //     },
            // ];
            // const attachments = [
            //     {
            //         attachmentID: 0,
            //         fileName: 'cat.png',
            //         fileUrl: 'https://cataas.com/cat',
            //     },
            //     {
            //         attachmentID: 1,
            //         fileName: 'masha.png',
            //         fileUrl: 'https://cataas.com/cat/says/masha_ochen_lenivaya',
            //     },
            // ];
            this.createTask(task.taskID, task.taskName, task.taskDescription, task.taskOrder, task.taskTags, task.taskAttachments);
        }
    }

    /**
     * Create TaskController and add it to array
     * @param {number} taskID
     * @param {string} taskName
     * @param {string} taskDescription
     * @param {number} order
     * @param {[Object]} tags
     * @param {[Object]} attachments
     */
    createTask(taskID = -1, taskName= '', taskDescription = '',
        order = this.tasks.length, tags = [], attachments = []) {
        const taskObj = {
            boardID: this.model.card.boardID,
            cardID: this.model.card.cardID,
            taskID: taskID,
            taskName: taskName,
            taskDescription: taskDescription,
            order: order,
            tags: tags,
            attachments: attachments,
            contentEditable: (taskID === -1).toString(),
            isInitialized: taskID !== -1,
        };
        const newTask = new TaskController(this.tasksDiv, this.model.board, taskObj);
        this.tasks.push(newTask);

        this.view.renderTask(newTask);
    }

    /**
     * Add existing TaskController to array
     * @param {HTMLElement} taskHTML
     * @param {TaskController} taskController
     */
    addTask(taskHTML, taskController) {
        taskController.updateTaskIDs(undefined, this.model.card.cardID);
        let newElementIndex = 0;
        for (const taskEl of document.getElementById(this.model.card.tasksDiv).children) {
            if (taskEl === taskHTML) {
                break;
            }
            ++newElementIndex;
        }
        this.tasks.splice(newElementIndex, 0, taskController);

        this.updateTasksOrder();
    }

    /**
     * Delete task from array by it's HTMLElement
     * @param {HTMLElement} taskHTML
     */
    deleteTaskByHTML(taskHTML) {
        this.tasks.splice(Number.parseInt(taskHTML.dataset.order), 1);

        this.updateTasksOrder();
    }

    /**
     * Delete task from array by it's ID and update tasks order
     * @param {number} taskID
     */
    deleteTaskByID(taskID) {
        for (const [taskIndex, task] of this.tasks.entries()) {
            if (task.model.task.taskID === taskID) {
                this.tasks.splice(taskIndex, 1);
                break;
            }
        }
        this.updateTasksOrder();
        this.model.changeTasksOrderOnServer(this.tasks);
    }

    /**
     * Update tasks order in TaskController
     */
    updateTasksOrder() {
        for (const [taskIndex, task] of this.tasks.entries()) {
            task.updateTaskOrder(taskIndex);
        }
    }

    /**
     * Change task order inside one card
     * @param {HTMLElement} taskHTML
     */
    changeTaskOrder(taskHTML) {
        const oldElementIndex = Number.parseInt(taskHTML.dataset.order);
        const taskData = this.tasks[oldElementIndex];
        this.tasks.splice(oldElementIndex, 1);

        let newElementIndex = 0;
        for (const taskEl of document.getElementById(this.model.card.tasksDiv).children) {
            if (taskEl === taskHTML) {
                break;
            }
            ++newElementIndex;
        }
        this.tasks.splice(newElementIndex, 0, taskData);

        this.updateTasksOrder();
        this.model.changeTasksOrderOnServer(this.tasks);
    }

    /**
     * Update card name data or create new card on server if needed
     * @param {string} newName
     */
    updateCardName(newName) {
        this.model.card.cardName = newName;
        if (this.model.card.isInitialized) {
            this.model.updateCardForServer();
        } else {
            this.model.card.isInitialized = true;
            this.model.createCardForServer();
        }
    }

    /**
     * Add all event listeners
     */
    addEventListeners() {
        this.eventBus.on('cardView:viewRendered', (tasksDiv) => {
            this.tasksDiv = tasksDiv;
        });
        this.eventBus.on('cardView:addNewTask', () => {
            this.createTask();
        });
        this.eventBus.on('cardView:updateCardName', (newName) => {
            this.updateCardName(newName);
        });
        this.eventBus.on('cardView:deleteCard', () => {
            if (this.model.card.isInitialized) {
                this.model.deleteCard();
            }
            globalEventBus.emit('cardController:deleteCardFromArray', this.model.card.cardID);
        });
        this.eventBus.on('cardModel:createCardFailed', (errorCodes) => {
            console.log('cardModel:createCardFailed');
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('cardModel:createCardSuccess', (responseBody) => {
            console.log('cardModel:createCardSuccess');
            console.log(responseBody);
            this.view.updateCardHtmlIDs(this.model.card, responseBody.cardID);
            this.model.updateCardIDs(responseBody.cardID);
        });
        this.eventBus.on('cardModel:setCardFailed', (errorCodes) => {
            console.log('cardModel:setCardFailed');
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('cardModel:setCardSuccess', (data) => {
            console.log('cardModel:setCardSuccess');
            console.log(data);
        });
        this.eventBus.on('cardModel:changeTaskOrderOnServerFailed', (errorCodes) => {
            console.log('cardModel:changeTaskOrderOnServerFailed');
            for (const code of errorCodes) {
                console.log(code);
            }
        });
        this.eventBus.on('cardModel:changeTaskOrderOnServerSuccess', (data) => {
            console.log('cardModel:changeTaskOrderOnServerSuccess');
            console.log(data);
        });
        globalEventBus.on('taskController:deleteTaskFromArray', (taskID) => {
            this.deleteTaskByID(taskID);
        });
    }

    /**
     * Add event listeners related to drag and drop
     */
    addDragAndDropEventListeners() {
        this.eventBus.on('cardView:taskOrderChanged', (draggedTask) => {
            this.changeTaskOrder(draggedTask);
        });

        globalEventBus.on('taskController:taskOrderChanged', ([cardID, draggedTask]) => {
            if (cardID === this.model.card.cardID) {
                this.changeTaskOrder(draggedTask);
            }
        });

        this.eventBus.on('cardView:taskMovedToThisCard', ([draggedTask, startTasksDiv]) => {
            globalEventBus.emit('cardController:taskMovedToAnotherCard', [draggedTask, startTasksDiv]);
        });

        globalEventBus.on('taskController:taskMovedToAnotherCard', ([draggedTask, startTasksDiv]) => {
            if (startTasksDiv.id === this.model.card.tasksDiv) {
                globalEventBus.emit('cardController:taskMovedToAnotherCard', [draggedTask, startTasksDiv]);
            }
        });

        globalEventBus.on('cardController:taskMovedToAnotherCard', ([draggedTask, startTasksDiv]) => {
            if (startTasksDiv.id === this.model.card.tasksDiv) {
                const deletedTaskController = this.tasks[Number.parseInt(draggedTask.dataset.order)];
                this.deleteTaskByHTML(draggedTask);
                globalEventBus.emit('cardController:taskRemovedFromOldCard',
                    [deletedTaskController, this, draggedTask]);
            }
        });

        globalEventBus.on('cardController:taskRemovedFromOldCard',
            ([deletedTaskController, oldCardController, draggedTask]) => {
                if (draggedTask.parentElement === this.tasksDiv) {
                    this.addTask(draggedTask, deletedTaskController);
                    this.model.changeTaskMultiCardOrderOnServer(oldCardController, this.tasks);
                }
            });
    }

    /**
     * Render card
     */
    render() {
        this.addEventListeners();
        this.view.render(this.model.card);
        this.addDragAndDropEventListeners();
    }
}
