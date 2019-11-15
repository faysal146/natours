import axios from '../ajax/axios';
import showAlert from '../component/alert';
const stripe = Stripe('pk_test_5PIDjXVc65gEiEwA6BzBkjNs00xV5NEMHB');

const getSessionData = async tourId => {
    axios.get(`bookings/checkout-session/${tourId}`)
        .then(session => {
            stripe.redirectToCheckout({
                sessionId: session.data.session.id
            });
        }).catch (err => {
            showAlert('error', err);
        })
    }
export default getSessionData;
