/* eslint-disable */
import '@babel/polyfill';
import mapDispaly from './mapbox';
import login from './login';
import { logout } from './user';

// dom
const displayMap = document.getElementById('map');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout');

if (displayMap) {
    mapDispaly(JSON.parse(displayMap.dataset.location));
}
if (loginForm) {
    loginForm.addEventListener('submit', login);
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
