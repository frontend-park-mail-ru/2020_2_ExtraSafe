import Router from "./router";

const router = new Router(app);

async function authRequest() {
    let user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    console.log(user.email, user.password)

    const resp = await fetch('http://127.0.0.1:8080/login/', {
        credentials: 'include',
        //credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (resp.ok) {
        return await resp.json()
    }
    console.log("no");
}

function regRequest() {
    let user = {
        email: document.getElementById('email').value,
        nickname: document.getElementById('fullName').value,
        password: document.getElementById('password').value
    };

    console.log(user.email, user.password)

    fetch('http://127.0.0.1:8080/reg/', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (response.ok) {
            console.log("ok")
            //router.open('/pro')
        }
        return response.json()
    }).then((responseBody) => {
        console.log(responseBody)
        return responseBody
    })

}
