/**
 * Current board model
 */
export default class CurrentBoardModel {
    /**
     * Current board model constructor
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.cards = {};
        this.cardsCount = 0;
    }

    /**
     * Add new card
     */
    addNewCard() {
        const id = ++this.cardsCount;
        const cardID = `card${id}`;
        const cardNameID = `cardName${id}`;
        const addTaskID = `addTask${id}`;

        this.cards[cardID] = {
            tasksCount: 0,
            templateJSON: {
                cardName: '',
                tasks: [],
                cardID: cardID,
                cardNameID: cardNameID,
                addTaskID: addTaskID,
            },
        };

        this.eventBus.emit('currentBoardModel:cardAdded', [this.cards, cardNameID]);
    }

    /**
     * Update card name
     * @param {string} cardID
     * @param {string} newName
     */
    updateCardName(cardID, newName) {
        this.cards[cardID].templateJSON.cardName = newName;
    }

    /**
     * add new task
     * @param {string} cardID
     */
    addNewTask(cardID) {
        const id = ++this.cards[cardID].tasksCount;
        const taskID = `${cardID}Task${id}`;
        const taskNameID = `${taskID}Name`;

        const taskJSON = {
            taskID: taskID,
            taskNameID: taskNameID,
            taskName: '',
            contentEditable: 'true',
            // colorTags: [
            //     '#a7d081',
            //     '#3b12f5',
            //     '#f1ace1',
            // ],
            // taskDeadline: '21 апр',
            // completedJobs: '3',
            // jobsCount: '5',
            // taskCollaborators: [
            //     {src: 'https://i.pinimg.com/originals/ca/c6/70/cac670991d812075a1df29804f084324.jpg'},
            // ],
        };
        this.cards[cardID].templateJSON.tasks.push(taskJSON);

        this.eventBus.emit('currentBoardModel:taskAdded', [this.cards, taskNameID]);
    }

    /**
     * Update task name
     * @param {string} cardID
     * @param {number} taskID
     * @param {string} newName
     */
    updateTaskName(cardID, taskID, newName) {
        const taskJSON = this.cards[cardID].templateJSON.tasks[taskID];
        taskJSON.taskName = newName;
        taskJSON.contentEditable = 'false';

        this.eventBus.emit('currentBoardModel:taskNameUpdated', taskJSON);
    }
}
