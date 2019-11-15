import axios from './axios';
import showAlert from '../component/alert'
import { showLoader, hideLoader } from '../component/loader'

function ajax ({path,userData,message}) {
    showLoader('.form button')
    axios
        .post(path, userData)
        .then(res => {
            if (res.data.status === 'success') {
               showAlert('success', message);
               window.location.assign('/')
            } else {
                showAlert('error', 'something went wrong');
                hideLoader()
            }
        })
        .catch(err => {
             hideLoader()
            showAlert('error',err.response.data.message)
        });
}
export default ajax;