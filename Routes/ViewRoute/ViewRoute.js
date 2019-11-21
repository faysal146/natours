const express = require('express');
const viewController = require('../../Controls/ViewController/ViewController');
const authController = require('../../Controls/AuthController/AuthController');
const bookingsController = require('../../Controls/BookingsController/BookingsController');

const router = express.Router();

router.get('/', authController.isLoggedin, bookingsController.confirmBooking, viewController.getOverView);
router.get('/tour/:tourSlug', authController.isLoggedin, viewController.getTour);
router.get('/login', authController.isLoggedin, viewController.protectRouteFormAuthUser, viewController.getLoginFrom);
router.get('/singup', authController.isLoggedin, viewController.protectRouteFormAuthUser, viewController.getSingupFrom);
router.get(
    '/forget-password',
    authController.isLoggedin,
    viewController.protectRouteFormAuthUser,
    viewController.getForgetPassword
);
router.get(
    '/reset-password',
    authController.isLoggedin,
    viewController.protectRouteFormAuthUser,
    viewController.validateForgetPasswordToken,
    viewController.getResetPassword
);

router.use(authController.protectRoute);
router.get('/account', viewController.userAccount);
router.get('/my-bookings', viewController.getMyBookings);
// direct from submit route
// router.post('/update-account', viewController.updataAccount);

module.exports = router;
