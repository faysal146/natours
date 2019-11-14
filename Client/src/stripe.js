import axios from 'axios';
import showAlert from './alert';
const stripe = Stripe('pk_test_5PIDjXVc65gEiEwA6BzBkjNs00xV5NEMHB');

const getSessionData = async tourId => {
    try {
        const session = await axios.get(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        showAlert('error', err);
    }
};

export default getSessionData;
