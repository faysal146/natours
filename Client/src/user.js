import axios from 'axios';
import showAlert from './alert';
function logout() {
    axios
        .get('http://localhost:3000/api/v1/users/logout')
        .then(res => {
            console.log(res.data);
            if (res.data.status === 'success') {
                showAlert('success', 'Loggin out....');
                location.reload(true); // reload from the server
            } else {
                showAlert('error', 'something went wrong');
            }
        })
        .catch(err => {
            console.log(err.response);
            showAlert('error', 'Error something went wrong...');
        });
}
export { logout };
