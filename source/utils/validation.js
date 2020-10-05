// регулярные выражения
const emailRegExp = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
const passwordRegExp = '^[a-zA-Z0-9~!@#$%^&*-_+=`|\\(){}:;"\'<>,.?/]+$';
const usernameRegExp = '^[a-zA-Z0-9_]+$';
// const fullNameRegExp = '^[a-zA-Zа-яА-Я _]+$';
const lowerCaseRegExp = '[a-z]+';
const upperCaseRegExp = '[A-Z]+';
const numbersRegExp = '[0-9]+';

/**
 *  email validation
 *  @return {object} Valid or inValid
 */
function validateEmail() {
    const email = document.getElementById('email').value;

    if (email.length === 0) {
        return {
            result: false,
            message: 'обязательное поле',
        };
    }

    if (!(new RegExp(emailRegExp)).test(email)) {
        return {
            result: false,
            message: 'некорректный email',
        };
    }

    return {result: true};
}

/**
 *  username validation
 *  @return {object}
 */
function validateUsername() {
    const username = document.getElementById('username').value;

    if (username.length === 0) {
        return {
            result: false,
            message: 'обязательное поле',
        };
    }

    if (username.length < 2 || username.length > 40) {
        return {
            result: false,
            message: 'минимальная длина имени - 2, максимальная - 40',
        };
    }

    if (!(new RegExp(usernameRegExp)).test(username)) {
        return {
            result: false,
            message: 'содержит некорректные символы',
        };
    }

    return {result: true};
}

/**
 *  full name validation
 *  @return {object}
 */
// function validateFullName() {
//     const fullName = document.getElementById('fullName').value;
//
//     if (fullName.length === 0) {
//         return {
//             result: false,
//             message: 'обязательное поле',
//         };
//     }
//
//     if (fullName.length < 2 || fullName.length > 40) {
//         return {
//             result: false,
//             message: 'минимальная длина имени - 2, максимальная - 40',
//         };
//     }
//
//     if (!(new RegExp(fullNameRegExp)).test(fullName)) {
//         return {
//             result: false,
//             message: 'содержит некорректные символы',
//         };
//     }
//
//     return {result: true};
// }

/**
 *  password validation
 *  @return {object}
 */
function validatePassword() {
    const password = document.getElementById('password').value;

    if (password.length === 0) {
        return {
            result: false,
            message: 'обязательное поле',
        };
    }

    if (!(new RegExp(passwordRegExp)).test(password) ||
      !(new RegExp(lowerCaseRegExp)).test(password) ||
      !(new RegExp(upperCaseRegExp)).test(password) ||
      !(new RegExp(numbersRegExp)).test(password) ||
      (password.length < 8 || password.length > 64)) {
        return {
            result: false,
            message: 'пароль должен содержать хотя бы одну строчную, заглавную буквы, цифру ' +
          'и иметь длину от 8 до 64 символов',
        };
    }

    return {result: true};
}

/**
 *  compare password validation
 *  @return {object}
 */
function validateComparePasswords() {
    const password = document.getElementById('password').value;
    const checkPassword = document.getElementById('checkPassword').value;

    if (password !== checkPassword) {
        return {
            result: false,
            message: 'пароли не совпадают',
        };
    }

    return {result: true};
}

/**
 *  render error div
 *  @param {string} inputId - error div id
 *  @param {function} validateFunc - validate function
 */
function updateError(inputId, validateFunc) {
    const errorElement = document.getElementById(`${inputId}Error`);
    const inputElement = document.getElementById(inputId);
    const validationResult = validateFunc();

    if (!validationResult.result) {
        inputElement.style.borderColor = '#FF0404';
        errorElement.innerHTML = validationResult.message;
        errorElement.hidden = false;
        return false;
    }

    inputElement.style.borderColor = '#808080';
    errorElement.innerHTML = '';
    errorElement.hidden = true;
    return true;
}

/**
 * render all error divs
 */
// eslint-disable-next-line no-unused-vars,require-jsdoc
function updateAllErrors() {
    let error = updateError('email', validateEmail);
    error *= updateError('password', validatePassword);
    error *= updateError('checkPassword', validateComparePasswords);
    error *= updateError('username', validateUsername);
    return error;
}

function updateAllErrorsPassword() {
    let error = updateError('password', validatePassword);
    error *= updateError('checkPassword', validateComparePasswords);
    return error;
}