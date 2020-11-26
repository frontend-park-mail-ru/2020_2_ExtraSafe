import {errorsDescription} from './errors.js';

/**
 * Rendering
 */
class Rendering {
    /**
     * render input error
     * @param {string} inputId - error input id
     * @param {object} error - error object
     * @return {boolean} error
     */
    renderInputError(inputId, error) {
        const errorElement = document.getElementById(`${inputId}Error`);
        const inputElement = document.getElementById(inputId);

        if (!error.result) {
            inputElement.style.borderColor = '#FF0404';
            errorElement.innerHTML = error.message;
            errorElement.hidden = false;
            return error.result;
        }

        inputElement.style.borderColor = '#808080';
        errorElement.innerHTML = '';
        errorElement.hidden = true;
        return error.result;
    }

    /**
     * print error
     * @param {errorsDescription} errors
     */
    printServerErrors(errors) {
        errors.forEach((element, i) => {
            console.log(element);
            const error = {
                result: false,
                message: errorsDescription[element].message,
            };
            this.renderInputError(errorsDescription[element].field, error);
        });
    }

    /**
     * update profile img
     */
    updateProfileImg() {
        const profileAvatar = document.getElementById('profileAvatar');
        profileAvatar.src = URL.createObjectURL(event.target.files[0]);
    }

    /**
     * create elements from template
     * @param {string} html
     * @return {HTMLCollection}
     */
    createElementsFromTmpl(html) {
        const el = document.createElement('div');
        el.innerHTML = html;
        return el.children;
    }
}

export default new Rendering();
