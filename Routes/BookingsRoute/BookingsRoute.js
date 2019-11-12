const express = require('express');

const authController = require('../../Controls/AuthController/AuthController');
const bookingsController = require('../../Controls/BookingsController/BookingsController');

const bookingsRouter = express.Router();

bookingsRouter.use(authController.protectRoute);
bookingsRouter.get('/checkout-session/:tourId', bookingsController.getBookings);

module.exports = bookingsRouter;
