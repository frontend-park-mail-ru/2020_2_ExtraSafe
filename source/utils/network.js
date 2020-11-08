import globalEventBus from './globalEventBus.js';

/**
 * Network
 */
class Network {
    /**
     * Constructor
     */
    constructor() {
        // this.serverAddr = 'http://tabutask.ru:8080';
        this.serverAddr = 'http://127.0.0.1:8080';
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
            },
        };
        this.requestPut = {
            mode: 'cors',
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        this.requestDelete = {
            mode: 'cors',
            credentials: 'include',
            method: 'DELETE',
        };
        this.requestFormData = {
            mode: 'cors',
            credentials: 'include',
            method: 'POST',
        };
    }

    /**
     * Send sign in request to server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    loginRequest(data) {
        const url = this.serverAddr + '/login/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * Send sign up request to server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    regRequest(data) {
        const url = this.serverAddr + '/reg/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * Send request to server to check
     * if user is authorized
     * @return {Promise<Response>}
     */
    authRequest() {
        const url = this.serverAddr + '/';

        return fetch(url, this.requestGet);
    }

    /**
     * get profile information from server
     * @return {Promise<Response>}
     */
    profileGet() {
        const url = this.serverAddr + '/profile/';

        return fetch(url, this.requestGet);
    }

    /**
     * get accounts information from server
     * @return {Promise<Response>}
     */
    accountsGet() {
        const url = this.serverAddr + '/accounts/';

        return fetch(url, this.requestGet);
    }

    /**
     * request to change profile data on server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    profileSet(data) {
        const url = this.serverAddr + '/profile/';
        this.requestFormData.body = data;

        return fetch(url, this.requestFormData);
    }

    /**
     * request to change accounts data on server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    accountsSet(data) {
        const url = this.serverAddr + '/accounts/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to change password data on server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    passwordSet(data) {
        const url = this.serverAddr + '/password/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * logout request to server
     * @return {Promise<void>}
     */
    logout() {
        const url = this.serverAddr + '/logout/';
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
        const url = this.serverAddr + '/board/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to get data for board by id
     * @param {string}boardID
     * @return {Promise<Response>}
     */
    boardGet(boardID) {
        const url = this.serverAddr + '/board/' + boardID + '/';

        return fetch(url, this.requestGet);
    }

    /**
     * request to change data for board
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    boardSet(data) {
        const url = this.serverAddr + '/board/' + data.boardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to get data for board by id
     * @param {string}boardID
     * @return {Promise<Response>}
     */
    boardDelete(boardID) {
        const url = this.serverAddr + '/board/' + boardID + '/';

        return fetch(url, this.requestDelete);
    }

    /**
     * request to create card
     * @param {requestData} data
     * @param {string} boardID
     * @return {Promise<Response>}
     */
    cardCreate(data, boardID) {
        const url = this.serverAddr + '/card/' + boardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to get data for card by id
     * @param {string}cardID
     * @return {Promise<Response>}
     */
    cardGet(cardID) {
        const url = this.serverAddr + '/card/' + cardID + '/';

        return fetch(url, this.requestGet);
    }

    /**
     * request to change data for card
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    cardSet(data) {
        const url = this.serverAddr + '/card/' + data.cardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to delete card
     * @param {string}cardID
     * @return {Promise<Response>}
     */
    cardDelete(cardID) {
        const url = this.serverAddr + '/card/' + cardID + '/';

        return fetch(url, this.requestDelete);
    }

    /**
     * request to create task
     * @param {requestData} data
     * @param {string} boardID
     * @return {Promise<Response>}
     */
    taskCreate(data, boardID) {
        const url = this.serverAddr + '/task/' + boardID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPost);
    }

    /**
     * request to get data for task by id
     * @param {string}taskID
     * @return {Promise<Response>}
     */
    taskGet(taskID) {
        const url = this.serverAddr + '/task/' + taskID + '/';

        return fetch(url, this.requestGet);
    }

    /**
     * request to change data for task
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    taskSet(data) {
        const url = this.serverAddr + '/task/' + data.taskID + '/';
        this.requestPost.body = JSON.stringify(data);

        return fetch(url, this.requestPut);
    }

    /**
     * request to delete task
     * @param {string}taskID
     * @return {Promise<Response>}
     */
    taskDelete(taskID) {
        const url = this.serverAddr + '/task/' + taskID + '/';

        return fetch(url, this.requestDelete);
    }
}

export default new Network();
