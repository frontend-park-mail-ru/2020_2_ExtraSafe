"use strict"

let FORM_NAME = "form" // название формы регистрации/авторизации

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
    //console.log(upperCaseLetters)
    let lowerCaseLetters = password.match(/[a-z]/)
    //console.log(lowerCaseLetters)
    let numbers =  password.match(/[0-9]/g)
    //console.log(numbers)

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
    let firstPassword = document.forms[FORM_NAME]["password"].value;
    let secondPassword = document.forms[FORM_NAME]["confirmPassword"].value;

    if (firstPassword !== secondPassword) {
        document.getElementById("passwordForm").innerHTML="пароли не совпадают";
        return false;
    }

    if (validatePassword() !== false) {
        document.getElementById("passwordForm").innerHTML="";
    }
}

function validateSignUp() {
    validateEmail();
    validateUsername();
    validatePassword();
    validateComparePasswords();

    return false;
}


function validateSignIn() {
    return validateEmail() && validatePassword()
}