ServerAddr = 'http://127.0.0.1:8080/';

/**
 * Send sign in request to server
 * @param {requestData} data
 * @return {Promise<Response>}
 */
function loginRequest(data) {
    const url = ServerAddr + 'login/';

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
function regRequest(data) {
    const url = ServerAddr + 'reg/';

    return fetch(url, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

/**
 * Send request to server to check
 * if user is authorized
 * @return {Promise<Response>}
 */
function authRequest() {
    const url = ServerAddr;

    return fetch(url, {
        credentials: 'include',
        method: 'GET',
    });
}

/**
 * get profile information from server
 * @return {Promise<Response>}
 */
function profileGet() {
    const url = ServerAddr + 'profile/';

    return fetch(url, {
        credentials: 'include',
        method: 'GET',
    });
}

/**
 * get accounts information from server
 * @return {Promise<Response>}
 */
function accountsGet() {
    const url = ServerAddr + 'accounts/';

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
function profileSet(data) {
    const url = ServerAddr + 'profile/';

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
function accountsSet(data) {
    const url = ServerAddr + 'accounts/';

    return fetch(url, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

/**
 * request to change password data on server
 * @param {requestData} data
 * @return {Promise<Response>}
 */
function passwordSet(data) {
    const url = ServerAddr + 'password/';

    return fetch(url, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

/**
 * logout request to server
 * @return {Promise<Response>}
 */
function logout() {
    const url = ServerAddr + 'logout/';

    return fetch(url, {
        credentials: 'include',
        method: 'GET',
    });
}
