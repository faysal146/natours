const express = require('express');

const authController = require('../../Controls/AuthController/AuthController');
const bookingsController = require('../../Controls/BookingsController/BookingsController');

const router = express.Router();

// all the route only use auth user
router.use(authController.protectRoute);
router.get('/checkout-session/:tourId', bookingsController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));
router.get('/', bookingsController.getAllBookings).post(bookingsController.createBooking);
router
    .route('/:id')
    .get(bookingsController.getOneBooking)
    .patch(bookingsController.updateBooking)
    .delete(bookingsController.deleteBooking);

module.exports = router;
