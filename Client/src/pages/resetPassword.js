import '@babel/polyfill';
import isLength from 'validator/lib/isLength';
import showAlert from '../component/alert';
import { showLoader, hideLoader } from '../component/loader';
import axios from '../ajax/axios';
const resetPassword = document.getElementById('resetPassword-form');

const updataAjax = ({ path, formData, message }) => {
    showLoader(`.form button`);
    return axios
        .patch(path, formData)
        .then(res => {
            if (res.data.status === 'success') {
                window.location.assign('/');
                showAlert('success', message);
                hideLoader();
            } else {
                showAlert('error', 'something went wrong....');
                hideLoader();
            }
        })
        .catch(err => {
            hideLoader();
            showAlert('error', err.response.data.message);
        });
};

resetPassword.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (!isLength(password, { min: 8 })) {
        showAlert('error', 'Password should be 8 characters');
    } else if (password !== confirmPassword) {
        showAlert('error', 'Password does not match');
    } else {
        const urlPar = new URLSearchParams(window.location.search);
        const token = urlPar.get('token');
        if (!token) return showAlert('error', 'Invalid Token');
        const options = {
            path: `users/reset-password/${token}`,
            formData: { password, confirmPassword },
            message: 'Your password reset successfully'
        };
        console.log(options);
        updataAjax(options);
    }
});
