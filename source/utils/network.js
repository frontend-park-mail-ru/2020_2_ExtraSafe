/**
 * Network
 */
export default class Network {
    /**
     * Constructor
     */
    constructor() {
        //this.serverAddr = 'http://tabutask.ru:8080';
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
        const url = this.serverAddr + "/";

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
     * @return {Promise<Response>}
     */
    logout() {
        const url = this.serverAddr + '/logout/';

        return fetch(url, this.requestGet);
    }
}
