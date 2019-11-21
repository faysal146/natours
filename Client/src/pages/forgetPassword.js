import '@babel/polyfill';
import isEmail from 'validator/lib/isEmail';
import showAlert from '../component/alert';
import ajax from '../ajax/ajax';
const forgetPassword = document.getElementById('forgetPassword-form');

forgetPassword.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (!isEmail(email)) {
        showAlert('error', 'Please provide valid email address');
    } else {
        const options = {
            path: 'users/forgot-password',
            userData: { email },
            message: 'Password reset link send to the email'
        };
        ajax(options);
    }
});
