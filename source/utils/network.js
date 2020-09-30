
function authRequest() {
    let user = {
        name: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    console.log(user.name, user.password)

    try {
        const response = fetch('http://127.0.0.1:8080/login/', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = response.json();
        console.log('Успех:', JSON.stringify(json));
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
