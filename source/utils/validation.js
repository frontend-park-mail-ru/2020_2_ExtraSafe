"use strict"

/* проверка валидности email:
    длина не равна 0;
    не содержит больше или меньше @ и ., чем нужно
*/
function validateEmail() {
    let email = document.getElementById("email").value
    let emailError = document.getElementById('emailError')

    let at = email.split("@").length - 1;
    let dot = email.split(".").length - 1;

    if (email.length === 0) {
        emailError.innerHTML="данное поле необходимо для заполнения";
        emailError.hidden=false
        return false;
    } else if (at > 1 || dot > 1) {
        emailError.innerHTML="не верный email";
        emailError.hidden=false
        return false;
    }

    emailError.innerHTML="";
    emailError.hidden=true

    return true
}

/* проверка валидности username:
    длина не равна 0;
    длина меньше 64 (пусть пока так будет)
*/
// данная функция пока (или вообще?) не используется
function validateUsername() {
    let username = document.forms[FORM_NAME]["username"].value;

    if (username.length === 0) {
        document.getElementById("usernameForm").innerHTML="данное поле необходимо для заполнения";
        return false;
    }

    if (username.length > 64) {
        document.getElementById("usernameForm").innerHTML="максимальное количество символов - 64";
        return false;
    }

    document.getElementById("usernameForm").innerHTML="";
}

/* проверка валидности password:
    длина не равна 0;
    длина не меньше 8 символов;
    пароль содержит заглавные и строчные буквы, а также цифры
*/
function validatePassword() {
    let password = document.getElementById("password").value
    let passwordError = document.getElementById("passwordError")

    if (password.length === 0) {
        passwordError.innerHTML="данное поле необходимо для заполнения";
        passwordError.hidden=false
        return false;
    }

    if (password.length < 8) {
        passwordError.innerHTML="минимальная длина пароля - 8 символов";
        passwordError.hidden=false
        return false;
    }

    let upperCaseLetters = password.match(/[A-Z]/)
    let lowerCaseLetters = password.match(/[a-z]/)
    let numbers = password.match(/[0-9]/g)

    if ((upperCaseLetters === null) || (lowerCaseLetters === null) || (numbers === null)) {
        passwordError.innerHTML="пароль должен содержать цифры, строчные " +
                                                                    "и заглавные буквы";
        passwordError.hidden=false
        return false;
    }

    passwordError.innerHTML="";
    passwordError.hidden=true

    return true
}

// проверка идентичности паролей
function validateComparePasswords() {
    let password = document.getElementById("password").value;
    let checkPassword = document.getElementById("checkPassword").value;
    let compareError = document.getElementById("compareError")

    if (password !== checkPassword) {
        compareError.innerHTML="пароли не совпадают";
        compareError.hidden=false
        return false;
    }

    if (validatePassword() !== false) {
        compareError.innerHTML="";
        compareError.hidden=true
    }

    return true
}

function validateSignUp() {
    return validateEmail() && validatePassword() && validateComparePasswords()
}


function validateSignIn() {
    return validateEmail() && validatePassword()
}