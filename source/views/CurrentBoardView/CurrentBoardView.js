import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import './CurrentBoardView.tmpl.js';
import '../../components/Card/Card.tmpl.js';

/**
 * Class Current board view.
 */
export default class CurrentBoardView extends BaseView {
    /**
     * CurrentBoardView constructor.
     * @constructor
     * @param {HTMLElement} el - Root application div.
     * @param {EventBus} eventBus
     */
    constructor(el, eventBus) {
        super(el, eventBus);
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

        this.renderCards();
        document.getElementById(cardNameID).focus();
    }

    /**
     * Update card name
     * @param {string} cardID
     */
    updateCardName(cardID) {
        const cardJSON = this.cards[cardID].templateJSON;
        cardJSON.cardName = document.getElementById(cardJSON.cardNameID).innerHTML;
    }

    /**
     * Render cards
     */
    renderCards() {
        this.cardsDiv.innerHTML = '';

        // eslint-disable-next-line no-unused-vars
        for (const [cardID, card] of Object.entries(this.cards)) {
            this.cardsDiv.innerHTML += window.fest['components/Card/Card.tmpl'](card.templateJSON);
        }

        for (const [cardID, card] of Object.entries(this.cards)) {
            document.getElementById(cardID).addEventListener('focusout', () => {
                this.updateCardName(cardID);
            });
            document.getElementById(card.templateJSON.addTaskID).addEventListener('click', () => {
                this.addNewTask(cardID);
            });

            for (const [taskID, task] of card.templateJSON.tasks.entries()) {
                const taskEl = document.getElementById(task.taskNameID);
                taskEl.addEventListener('focusout', () => {
                    this.updateTaskName(cardID, taskID);
                }, false);
                taskEl.addEventListener('click', () => {
                    this.eventBus.emit('currentBoardView:openTaskDetailed', task);
                }, false);
            }
        }
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
        this.renderCards();
        document.getElementById(taskNameID).focus();
    }

    /**
     * Update task name
     * @param {string} cardID
     * @param {number} taskID
     */
    updateTaskName(cardID, taskID) {
        const cardJSON = this.cards[cardID].templateJSON.tasks[taskID];
        const taskEl = document.getElementById(cardJSON.taskNameID);

        cardJSON.taskName = taskEl.innerHTML;
        cardJSON.contentEditable = 'false';

        taskEl.contentEditable = 'false';
        taskEl.style.wordBreak = 'break-word';
    }

    /**
     * add all event listeners
     */
    addEventListeners() {
        this.cardsDiv = document.getElementById('cardsDiv');
        document.getElementById('addCardButton')
            .addEventListener('click', () => {
                this.addNewCard();
            }, false);
    }

    /**
     * setup template input data
     * @return {JSON} templateData
     */
    templateJSONSetup() {
        return {
            boardName: 'Лучшая тестовая доска',
            boardCollaborators: [
                {src: 'https://i.pinimg.com/originals/ca/c6/70/cac670991d812075a1df29804f084324.jpg'},
                {src: 'https://i.pinimg.com/originals/ca/c6/70/cac670991d812075a1df29804f084324.jpg'},
            ],
            cards: [
                {
                    cardName: 'Карточка топ',
                    tasks: [
                        {
                            taskDescription: 'Сделать нормальную вертску два раза!! И потом повторить!',
                            colorTags: [
                                '#a7d081',
                                '#3b12f5',
                                '#f1ace1',
                            ],
                            taskDeadline: '21 апр',
                            completedJobs: '3',
                            jobsCount: '5',
                            taskCollaborators: [
                                {src: 'https://i.pinimg.com/originals/ca/c6/70/cac670991d812075a1df29804f084324.jpg'},
                            ],
                        },
                        {
                            taskDescription: 'Не знаю что тут писать',
                            colorTags: [
                                '#f1ace1',
                                '#a7d081',
                            ],
                            taskDeadline: '2 авг',
                            completedJobs: '2',
                            jobsCount: '3',
                            taskCollaborators: [
                                {src: 'https://i.pinimg.com/originals/ca/c6/70/cac670991d812075a1df29804f084324.jpg'},
                                {src: 'https://i.pinimg.com/originals/ca/c6/70/cac670991d812075a1df29804f084324.jpg'},
                            ],
                        },
                    ],
                },
            ],
        };
    }

    /**
     * Render Current Board view.
     */
    render() {
        Navbar.navbarShow();
        const templateInput = this.templateJSONSetup();
        this.el.innerHTML = window.fest['views/CurrentBoardView/CurrentBoardView.tmpl'](templateInput);
        this.addEventListeners();
    }
}
