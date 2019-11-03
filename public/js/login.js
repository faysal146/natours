/* eslint-disable */

async function login(email, password) {
    try {
        const res = await axios.post('http://localhost:3000/api/v1/users/login', {
            email,
            password
        });
        if (res.data.status === 'success') {
            window.location.assign('/');
        }
    } catch (err) {
        alert(err.response.data.message);
    }
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
});
