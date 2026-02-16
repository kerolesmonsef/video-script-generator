import Swal from 'sweetalert2';

/**
 * Show a success message with SweetAlert2
 * @param {string} title - The title of the success message
 * @param {string} text - The text content of the success message (optional)
 */
export const success = (title, text = '') => {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        position: 'top-end',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        customClass: {
            popup: 'swal-toast-popup'
        }
    });
};

/**
 * Show an error message with SweetAlert2
 * @param {string} title - The title of the error message
 * @param {string} text - The text content of the error message (optional)
 */
export const fail = (title, text = '') => {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        position: 'top-end',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        customClass: {
            popup: 'swal-toast-popup'
        }
    });
};

/**
 * Show a warning message with SweetAlert2
 * @param {string} title - The title of the warning message
 * @param {string} text - The text content of the warning message (optional)
 */
export const warning = (title, text = '') => {
    Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        position: 'top-end',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        customClass: {
            popup: 'swal-toast-popup'
        }
    });
};

/**
 * Show a confirmation dialog
 * @param {string} title - The title of the confirmation
 * @param {string} text - The text content of the confirmation
 * @param {string} confirmButtonText - Text for confirm button (default: 'نعم')
 * @param {string} cancelButtonText - Text for cancel button (default: 'إلغاء')
 * @returns {Promise<boolean>} - Returns true if confirmed, false if cancelled
 */
export const confirm = async (title, text, confirmButtonText = 'نعم', cancelButtonText = 'إلغاء') => {
    const result = await Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        reverseButtons: true
    });

    return result.isConfirmed;
};

