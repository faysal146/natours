const hideAlert = (type, meg) => {
    const alert = document.querySelector('.alert');
    if (alert) {
        alert.parentElement.removeChild(alert);
    }
};
const showAlert = (type, meg) => {
    hideAlert();
    const markUp = `<div class="alert alert--${type}">${meg}</div>`;
    document.body.insertAdjacentHTML('afterbegin', markUp);
    setTimeout(() => hideAlert(), 5000);
};

export default showAlert;
