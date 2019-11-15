import showAlert from '../component/alert';
import axios from '../ajax/axios'

const logoutBtn = document.getElementById('logout');

if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
}

function logoutUser () {
     axios
        .get('users/logout')
        .then(res => {
            if (res.data.status === 'success') {
                showAlert('success', 'Loggin out....');
                window.location.assign('/');
                location.reload(true); // reload from the server
            } else {
                showAlert('error', 'something went wrong');
            }
        })
        .catch(err => {
            showAlert('error', 'Error something went wrong...');
        });
}

