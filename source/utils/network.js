ServerAddr = 'http://127.0.0.1:8080/';

/**
 * Send sign in request to server
 * @param data
 * @returns {Promise<Response>}
 */
function loginRequest(data) {
    const url = ServerAddr + 'login/';

    return fetch(url, {
        credentials: 'include',
        //credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

/**
 * Send sign up request to server
 * @param data
 * @returns {Promise<Response>}
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
 * @returns {Promise<Response>}
 */
function authRequest() {
    const url = ServerAddr;

    return fetch(url, {
        credentials: 'include',
        method: 'GET',
    });
}

function profileGet() {
    const url = ServerAddr + 'profile/';

    return fetch(url, {
        credentials: 'include',
        method: 'GET',
    });
}

function accountsGet() {
    const url = ServerAddr + 'accounts/';

    return fetch(url, {
        credentials: 'include',
        method: 'GET',
    });
}

function profileSet(data) {
    const url = ServerAddr + 'profile/';

    return fetch(url, {
        credentials: 'include',
        method: 'POST',
        body: data,
    });
}

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

function logout() {
    const url = ServerAddr + 'logout/';

    return fetch(url, {
        credentials: 'include',
        method: 'GET',
    });
}
