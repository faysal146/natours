/* eslint-disable */
import axios from 'axios';
import showAlert from './alert';

function postLoginData(email, password) {
    axios
        .post('http://localhost:3000/api/v1/users/login', {
            email,
            password
        })
        .then(data => {
            if (data.data.status === 'success') {
                showAlert('success', 'You are now Loggin');
            }
            setTimeout(() => window.location.assign('/'), 1000);
        })
        .catch(err => showAlert('error', err.response.data.message));
}

function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    postLoginData(email, password);
}
export default login;
