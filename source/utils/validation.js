"use strict"

const emailRegExp = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$.';
const passwordRegExp = '^[a-zA-Z0-9_+-!]$';
const usernameRegExp = '^[a-zA-Z0-9_]$';
const lowerCaseRegExp = '[a-z]+';
const upperCaseRegExp = '[A-Z]+';
const numbersRegExp = '[0-9]+';


function validateEmail() {
    let email = document.getElementById("email").value;
    return (new RegExp(emailRegExp)).test(email);
}


function validateUsername() {
    let username = document.getElementById("username").value;

    if (username.length === 0) {
        return {result: false, message: "обязательное поле"};
    }

    if (username.length < 2 || username.length > 40) {
        return {result: false, message: "минимальная длина имени - 2, максимальная - 40"};
    }

    if (!(new RegExp(usernameRegExp)).test(username)) {
        return {result: false, message: "содержит некорректные символы"};
    }

    return {result: true};
}


function validatePassword() {
    let password = document.getElementById("password").value;

    if (password.length === 0) {
        return {result: false, message: "обязательное поле"};
    }

    if (!new RegExp(passwordRegExp).test(password)) {
        return {result: false, message: "пароль содержит неразрешенные символы"};
    }

    if (!(new RegExp(lowerCaseRegExp)).test(password)) {
        return {result: false, message: "пароль должен содержать хотя бы одну строчную букву"};
    }

    if (!(new RegExp(upperCaseRegExp)).test(password)) {
        return {result: false, message: "пароль должен содержать хотя бы одну заглавную букву"};
    }

    if (!(new RegExp(numbersRegExp)).test(password)) {
        return {result: false, message: "пароль должен содержать хотя бы одну цифру"};
    }

    return {result: true}
}

function validateComparePasswords() {
    let password = document.getElementById("password").value;
    let checkPassword = document.getElementById("checkPassword").value;

    if (password !== checkPassword) {
        return {result: false, message: "пароли не совпадают"};
    }

    return {result: true}
}
