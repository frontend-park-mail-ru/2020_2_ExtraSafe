import BaseView from '../BaseView/BaseView.js';
import Navbar from '../../components/Navbar/Navbar.js';
import './CurrentBoardView.tmpl.js';

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
    }
}
