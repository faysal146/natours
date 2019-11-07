/* eslint-disable */
import '@babel/polyfill';
import mapDispaly from './mapbox';
import login from './login';
import { logout } from './user';
import { upDateData, upDatePassword } from './updataUserData';

// dom
const displayMap = document.getElementById('map');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout');
const upDateForm = document.getElementById('form--info--update');
const upDatePasswordForm = document.getElementById('update-password-form');

if (displayMap) {
    mapDispaly(JSON.parse(displayMap.dataset.location));
}
if (loginForm) {
    loginForm.addEventListener('submit', login);
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
if (upDateForm) {
    upDateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.querySelector('#form--info--update #name').value;
        const email = document.querySelector('#form--info--update #email').value;
        upDateData(name, email);
    });
}
if (upDatePasswordForm) {
    upDatePasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btnSavePass = document.querySelector('#update-password-form .btn');
        btnSavePass.textContent = 'Updateing...';

        const currPass = document.querySelector('#update-password-form #password-current').value;
        const pass = document.querySelector('#update-password-form #password').value;
        const newPass = document.querySelector('#update-password-form #password-confirm').value;
        upDatePassword(currPass, pass, newPass).then((res) => {
            btnSavePass.textContent = 'Save password';
            document.querySelector('#update-password-form #password-current').value = '';
            document.querySelector('#update-password-form #password').value = '';
            document.querySelector('#update-password-form #password-confirm').value = '';
        });
    });
}
