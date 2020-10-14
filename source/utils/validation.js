/**
 * Validation
 */
class Validation {
    /**
     * Constructor
     */
    constructor() {
        // регулярные выражения
        this.emailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
        this.passwordRegExp = new RegExp('^[a-zA-Z0-9~!@#$%^&*-_+=`|(){}:;"\'<>,.?/]+$');
        this.usernameRegExp = new RegExp('^[a-zA-Z0-9_]+$');
        this.fullNameRegExp = new RegExp('^[a-zA-Zа-яА-Я _]+$');
        // this.lowerCaseRegExp = new RegExp('[a-z]+');
        // this.upperCaseRegExp = new RegExp('[A-Z]+');
        // this.numbersRegExp = new RegExp('[0-9]+');
    }

    /**
     *  email validation
     *  @return {object} Valid or inValid
     */
    validateEmail() {
        const email = document.getElementById('email').value;

        if (email.length === 0) {
            return {
                result: false,
                message: 'обязательное поле',
            };
        }

        if (!this.emailRegExp.test(email)) {
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
    validateUsername() {
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

        if (!this.usernameRegExp.test(username)) {
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
    validateFullName() {
        const fullName = document.getElementById('fullName').value;

        if (fullName.length === 0) {
            return {result: true};
        }

        if (fullName.length > 40) {
            return {
                result: false,
                message: 'максимальная длина имени - 40',
            };
        }

        if (!this.fullNameRegExp.test(fullName)) {
            return {
                result: false,
                message: 'содержит некорректные символы',
            };
        }

        return {result: true};
    }

    /**
     *  password validation
     *  @return {object}
     */
    validatePassword() {
        const password = document.getElementById('password').value;

        if (password.length === 0) {
            return {
                result: false,
                message: 'обязательное поле',
            };
        }

        if (!this.passwordRegExp.test(password) ||
            (password.length < 4 || password.length > 64)) {
            return {
                result: false,
                message: 'пароль должен иметь длину от 4 до 64 символов',
            };
        }

        return {result: true};
    }

    /**
     *  compare password validation
     *  @return {object}
     */
    validateComparePasswords() {
        const password = document.getElementById('password').value;
        const checkPassword = document.getElementById('repeatPassword').value;

        if (password !== checkPassword) {
            return {
                result: false,
                message: 'пароли не совпадают',
            };
        }

        return {result: true};
    }
}

export default new Validation();
