import globalEventBus from './globalEventBus.js';

/**
 * Network
 */
class Network {
    /**
     * Constructor network
     */
    constructor() {
        this.serverAddr = 'https://tabutask.ru';
        this.serverAddrWS = 'wss://tabutask.ru';
        // this.serverAddr = 'http://127.0.0.1';
        // this.serverAddrWS = 'ws://127.0.0.1';
        this.requestGet = {
            mode: 'cors',
            credentials: 'include',
            method: 'GET',
        };
        this.requestPost = {
            mode: 'cors',
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': '',
            },
        };
        this.requestPut = {
            mode: 'cors',
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': '',
            },
        };
        this.requestDelete = {
            mode: 'cors',
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': '',
            },
        };
        this.requestFormData = {
            mode: 'cors',
            credentials: 'include',
            method: 'POST',
            headers: {
                'X-CSRF-Token': '',
            },
        };
    }

    /**
     * Send sign in request to server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    loginRequest(data) {
        const url = this.serverAddr + '/api/login/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * Send sign up request to server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    regRequest(data) {
        const url = this.serverAddr + '/api/reg/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * Send request to server to check
     * if user is authorized
     * @return {Promise<Response>}
     */
    authRequest() {
        const url = this.serverAddr + '/api/';

        return fetch(url, this.requestGet);
    }

    /**
     * get profile information from server
     * @return {Promise<Response>}
     */
    profileGet() {
        const url = this.serverAddr + '/api/profile/';

        return fetch(url, this.requestGet);
    }

    /**
     * request to change profile data on server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    profileSet(data) {
        const url = this.serverAddr + '/api/profile/';
        this.requestFormData.body = data;

        return fetch(url, this.requestFormData);
    }

    /**
     * request to change password data on server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    passwordSet(data) {
        const url = this.serverAddr + '/api/password/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * logout request to server
     * @return {Promise<void>}
     */
    logout() {
        const url = this.serverAddr + '/api/logout/';
        return fetch(url, this.requestGet).then((response) => {
            if (response.ok) {
                globalEventBus.emit('network:logout', null);
            }
        });
    }

    /**
     * request to create board
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    boardCreate(data) {
        const url = this.serverAddr + '/api/board/';
        console.log(data);
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to get data for board by id
     * @param {string}boardID
     * @return {Promise<Response>}
     */
    boardGet(boardID) {
        const url = this.serverAddr + '/api/board/' + boardID + '/';

        return fetch(url, this.requestGet);
    }

    /**
     * request to change data for board
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    boardSet(data) {
        const url = this.serverAddr + '/api/board/' + data.boardID + '/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to get data for board by id
     * @param {string}boardID
     * @return {Promise<Response>}
     */
    boardDelete(boardID) {
        const url = this.serverAddr + '/api/board/' + boardID + '/';

        return fetch(url, this.requestDelete);
    }

    /**
     * request to add user to board
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    userAddToBoard(data) {
        const url = this.serverAddr + '/api/board/' + data.boardID + '/user-add/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to remove user from board
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    userRemoveFromBoard(data) {
        const url = this.serverAddr + '/api/board/' + data.boardID + '/user-remove/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to create card
     * @param {requestData} data
     * @param {string} boardID
     * @return {Promise<Response>}
     */
    cardCreate(data, boardID) {
        const url = this.serverAddr + '/api/card/' + boardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to get data for card by id
     * @param {string}cardID
     * @return {Promise<Response>}
     */
    cardGet(cardID) {
        const url = this.serverAddr + '/api/card/' + cardID + '/';

        return fetch(url, this.requestGet);
    }

    /**
     * request to change data for card
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    cardSet(data) {
        const url = this.serverAddr + '/api/card/' + data.cardID + '/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to delete card
     * @param {string}cardID
     * @return {Promise<Response>}
     */
    cardDelete(cardID) {
        const url = this.serverAddr + '/api/card/' + cardID + '/';

        return fetch(url, this.requestDelete);
    }

    /**
     * request to change cards order
     * @param {requestData} data
     * @param {string} boardID
     * @return {Promise<Response>}
     */
    cardsOrder(data, boardID) {
        const url = this.serverAddr + '/api/card-order/' + boardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to create task
     * @param {requestData} data
     * @param {string} boardID
     * @return {Promise<Response>}
     */
    taskCreate(data, boardID) {
        const url = this.serverAddr + '/api/task/' + boardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to get data for task by id
     * @param {string}taskID
     * @return {Promise<Response>}
     */
    taskGet(taskID) {
        const url = this.serverAddr + '/api/task/' + taskID + '/';

        return fetch(url, this.requestGet);
    }

    /**
     * request to change data for task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    taskSet(data) {
        const url = this.serverAddr + '/api/task/' + data.taskID + '/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to delete task
     * @param {string}taskID
     * @return {Promise<Response>}
     */
    taskDelete(taskID) {
        const url = this.serverAddr + '/api/task/' + taskID + '/';

        return fetch(url, this.requestDelete);
    }

    /**
     * request to change tasks order
     * @param {requestData} data
     * @param {string} boardID
     * @return {Promise<Response>}
     */
    tasksOrder(data, boardID) {
        const url = this.serverAddr + '/api/task-order/' + boardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * get boards from server
     * @return {Promise<Response>}
     */
    getBoards() {
        const url = this.serverAddr + '/api/boards/';
        return fetch(url, this.requestGet);
    }

    /**
     * request to create tag
     * @param {requestData} data
     * @param {string} boardID
     * @return {Promise<Response>}
     */
    tagCreate(data) {
        const url = this.serverAddr + '/api/tag/' + data.boardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to change data for tag
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    tagSet(data) {
        const url = this.serverAddr + '/api/tag/' + data.boardID + '/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to delete tag from board
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    tagDelete(data) {
        const url = this.serverAddr + '/api/tag/' + data.boardID + '/';
        this.requestDelete.body = JSON.stringify(data);

        return fetch(url, this.requestDelete);
    }

    /**
     * request to add tag to task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    tagAddToTask(data) {
        const url = this.serverAddr + '/api/task/' + data.taskID + '/tag-add/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to add tag to task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    tagRemoveFromTask(data) {
        const url = this.serverAddr + '/api/task/' + data.taskID + '/tag-remove/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to add user to task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    userAddToTask(data) {
        const url = this.serverAddr + '/api/task/' + data.taskID + '/user-add/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to remove user from task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    userRemoveFromTask(data) {
        const url = this.serverAddr + '/api/task/' + data.taskID + '/user-remove/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }


    /**
     * request to create comment
     * @param {requestData} data
     * @param {string} taskID
     * @return {Promise<Response>}
     */
    commentCreate(data) {
        const url = this.serverAddr + '/api/comment/' + data.taskID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to change data for comment
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    commentSet(data) {
        const url = this.serverAddr + '/api/comment/' + data.commentID + '/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to delete comment from task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    commentDelete(data) {
        const url = this.serverAddr + '/api/comment/' + data.commentID + '/';
        this.requestDelete.body = JSON.stringify(data);

        return fetch(url, this.requestDelete);
    }

    /**
     * request to create checklist
     * @param {requestData} data
     * @param {string} taskID
     * @return {Promise<Response>}
     */
    checklistCreate(data) {
        const url = this.serverAddr + '/api/checklist/' + data.taskID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to change data for checklist
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    checklistSet(data) {
        const url = this.serverAddr + '/api/checklist/' + data.taskID + '/';
        this.requestPut.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to delete checklist from task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    checklistDelete(data) {
        const url = this.serverAddr + '/api/checklist/' + data.taskID + '/';
        this.requestDelete.body = JSON.stringify(data);

        return fetch(url, this.requestDelete);
    }

    /**
     * request to create attachment
     * @param {requestData} data
     * @param {string} taskID
     * @return {Promise<Response>}
     */
    attachmentCreate(data) {
        console.log(data);
        const url = this.serverAddr + '/api/attachment/' + data.get('taskID') + '/';
        this.requestFormData.body = data;

        return fetch(url, this.requestFormData);
    }

    /**
     * request to delete attachment from task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    attachmentDelete(data) {
        const url = this.serverAddr + '/api/attachment/' + data.taskID + '/';
        this.requestDelete.body = JSON.stringify(data);

        return fetch(url, this.requestDelete);
    }

    /**
     * request to stand websocket connection
     * @param {string} boardID
     * @return {WebSocket}
     */
    webSocketBoardConnection(boardID) {
        const url = this.serverAddrWS + '/api/ws/board/' + boardID + '/';

        const ws = new WebSocket(url);

        ws.onopen = function() {
            console.log('Connected webSocketBoard');
        };

        return ws;
    }

    /**
     * request to stand websocket connection
     * @return {WebSocket}
     */
    webSocketNotificationsConnection() {
        const url = this.serverAddrWS + '/api/ws/notification/';

        const ws = new WebSocket(url);

        ws.onopen = function() {
            console.log('Connected webSocketNotifications');
        };

        return ws;
    }

    /**
     * Check token error from server
     * @param {JSON} responseBody
     * @return {boolean}
     */
    ifTokenValid(responseBody) {
        if (responseBody.status === 777) {
            this.setToken(responseBody.token);
            return false;
        }
        return true;
    }

    /**
     * Set token to headers of requests
     * @param {string} token
     */
    setToken(token) {
        this.requestPost.headers['X-CSRF-Token'] = token;
        this.requestPut.headers['X-CSRF-Token'] = token;
        this.requestDelete.headers['X-CSRF-Token'] = token;
        this.requestFormData.headers['X-CSRF-Token'] = token;
    }

    /**
     * get shared url from server
     * @param {string} boardID
     * @return {Promise<Response>}
     */
    getSharedUrl(boardID) {
        const url = this.serverAddr + '/api/shared-url/' + boardID + '/';
        return fetch(url, this.requestGet);
    }

    /**
     * Accept invitation on board
     * @param {string} boardID
     * @param {string} sharedUrl
     * @return {Promise<Response>}
     */
    acceptInvitation(boardID, sharedUrl) {
        const url = this.serverAddr + '/api/invite/board/' + boardID + '/' + sharedUrl + '/';
        return fetch(url, this.requestGet);
    }
}

export default new Network();
