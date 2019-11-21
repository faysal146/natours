import '@babel/polyfill';
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import showAlert from '../component/alert';
import ajax from '../ajax/ajax'
const loginForm = document.getElementById('login-form');


loginForm.addEventListener('submit', e => {
     e.preventDefault()
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if(!isEmail(email)) {
         showAlert('error','Please provide valid email address')
    } else if(!isLength(password, {min: 8})) {
          showAlert('error','Password should be 8 characters')
    } else {
        const options = {
            path: 'users/login',
            userData : {email,password},
            message:  'Login to your account'
        }
        ajax(options)
    }
});