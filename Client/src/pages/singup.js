
import '@babel/polyfill';
import validator from 'validator'
import showAlert from '../component/alert';
import ajax from '../ajax/ajax'
const loginForm = document.getElementById('singup-form');

loginForm.addEventListener('submit', e => {
     e.preventDefault()
     const name = document.getElementById('name').value
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
     if(name === '') {
          showAlert('error','Enter name')
     } else if (!/^[a-zA-Z ]+$/.test(name)) {
          showAlert('error','name only contain alpha characters')
     } else if(!validator.isEmail(email)) {
         showAlert('error','Please provide valid email address')
     } else if(!validator.isLength(password, {min: 8})) {
               showAlert('error','Password should be 8 characters')
     } else if (password !== confirmPassword) {
               showAlert('error','Password does not match')
     } else {
          const options = {
               path: 'users/singup',
               userData : {name,email,password,confirmPassword},
               message:  'Please wait...'
               }
          ajax(options)
     }
})
