/**
 * Network
 */
export default class Network {
    /**
     * Constructor
     */
    constructor() {
        this.serverAddr = 'http://95.163.213.142:8080/';
    }

    /**
     * Send sign in request to server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    loginRequest(data) {
        const url = this.serverAddr + 'login/';

        return fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Send sign up request to server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    regRequest(data) {
        const url = this.serverAddr + 'reg/';

        return fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Send request to server to check
     * if user is authorized
     * @return {Promise<Response>}
     */
    authRequest() {
        const url = this.serverAddr;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        });
    }

    /**
     * get profile information from server
     * @return {Promise<Response>}
     */
    profileGet() {
        const url = this.serverAddr + 'profile/';

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        });
    }

    /**
     * get accounts information from server
     * @return {Promise<Response>}
     */
    accountsGet() {
        const url = this.serverAddr + 'accounts/';

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        });
    }

    /**
     * request to change profile data on server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    profileSet(data) {
        const url = this.serverAddr + 'profile/';

        return fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: data,
        });
    }

    /**
     * request to change accounts data on server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    accountsSet(data) {
        const url = this.serverAddr + 'accounts/';

        return fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * request to change password data on server
     * @param {requestData} data
     * @return {Promise<Response>}
     */
    passwordSet(data) {
        const url = this.serverAddr + 'password/';

        return fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * logout request to server
     * @return {Promise<Response>}
     */
    logout() {
        const url = this.serverAddr + 'logout/';

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        });
    }
}
