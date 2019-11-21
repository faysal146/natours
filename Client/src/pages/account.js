import '@babel/polyfill'; 
import axios from '../ajax/axios';
import showAlert from '../component/alert';
import { showLoader, hideLoader } from '../component/loader'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

const updateData = document.getElementById('update-info')
const updatePassword = document.getElementById('update-password')
 const userPhoto = document.querySelector('#photo');

const updataAjax = ({path,formData, message}) => {
     showLoader(`#update-${path.endsWith('account') ? 'info' : 'password'} button`)
     return axios.patch(path, formData)
          .then(res => {
               if (res.data.status === 'success') {
                   window.location.assign('/account');
                   showAlert('success', message);
               } else {
                   showAlert('error', 'something went wrong....');
                   hideLoader()
               }
          }) .catch(err => {
               hideLoader()
               showAlert('error', err.response.data.message);
          })
}
userPhoto.addEventListener('change', e => {
     const imgFile = e.target.files[0];
     const uploadPhoto = document.getElementById('upload-photo');
     uploadPhoto.src = window.URL.createObjectURL(imgFile);
});

const updateUserData = e => {
     e.preventDefault()
     const name = document.querySelector('#update-info #name').value;
     const email = document.querySelector('#update-info #email').value;
     const photo = document.querySelector('#photo').files[0];

     if(name === '') {
          showAlert('error','Enter name')
     } else if (!/^[a-zA-Z ]+$/.test(name)) {
          showAlert('error','name only contain alpha characters')
     } else if(!isEmail(email)) {
         showAlert('error','Please provide valid email address')
     } else {
          const form = new FormData();
          form.append('email', email);
          form.append('name', name);
          form.append('photo', photo);

          const options = {
               path: 'users/update-account',
               formData: form,
               message: 'your account info updated'
          }
          updataAjax(options)
     }
}

const updateUserPassword = e => {
     e.preventDefault();
     const currentPassword = document.querySelector('#password-current').value;
     const password = document.querySelector('#password').value;
     const confirmPassword = document.querySelector('#password-confirm').value;
     
     if(currentPassword === '' || password === '' || confirmPassword === '') {
          showAlert('error','Enter Password')
     } else if(!isLength(password, {min: 8})) {
          showAlert('error','Password should be 8 characters')
     } else if (password !== confirmPassword) {
          showAlert('error','Password does not match')
     } else {
          document.querySelector('#update-password button').textContent = 'Updateing...';
          const options = {
               path: 'users/update-password',
               formData:  {
                    currentPassword,
                    password,
                    confirmPassword
               },
               message: 'your password now changed'
          }
          updataAjax(options)
               .then(res => {
                    if(res.data.status === 'success') {
                         btnSavePass.textContent = 'Save password';
                         document.querySelector('#password-current').value = '';
                         document.querySelector('#password').value = '';
                         document.querySelector('#password-confirm').value = '';
                    }
               });
     }
}

updateData.addEventListener('submit', updateUserData)
updatePassword.addEventListener('submit', updateUserPassword)