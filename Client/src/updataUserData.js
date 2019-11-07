import axios from 'axios';
import showAlert from './alert';
async function upDateData(name, email) {
    try {
        const res = await axios.patch('http://localhost:3000/api/v1/users/update-account', {
            name,
            email
        });
        if (res.data.status === 'success') {
            window.location.reload();
            showAlert('success', 'account info updating...');
        } else {
            showAlert('error', 'something went wrong....');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

async function upDatePassword(currentPassword, password, confirmPassword) {
    try {
        const res = await axios.patch('http://localhost:3000/api/v1/users/update-password', {
            currentPassword,
            password,
            confirmPassword
        });
        console.log(res)
        if (res.data.status === 'success') {
            window.location.reload();
            showAlert('success', 'password is changed');
        } else {
            showAlert('error', 'something went wrong....');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export { upDateData, upDatePassword };
