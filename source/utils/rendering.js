/**
 * render input error
 * @param {string} inputId - error input id
 * @param {object} error - error object
 * @return {boolean} error
 */
function renderInputError(inputId, error) {
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
 * update profile img
 */
function updateProfileImg() {
    const profileAvatar = document.getElementById('profileAvatar');
    profileAvatar.src = URL.createObjectURL(event.target.files[0]);
}
