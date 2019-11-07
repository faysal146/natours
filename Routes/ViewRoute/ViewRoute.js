const express = require('express');
const viewController = require('../../Controls/ViewController/ViewController');
const authController = require('../../Controls/AuthController/AuthController');

const router = express.Router();

router.get('/', authController.isLoggedin, viewController.getOverView);
router.get('/tour/:tourSlug', authController.isLoggedin, viewController.getTour);
router.get('/login', authController.isLoggedin, viewController.getLoginFrom);
router.get('/singup', authController.isLoggedin, viewController.getSingupFrom);

router.use(authController.protectRoute);
router.get('/account', viewController.userAccount);
// direct from submit route
// router.post('/update-account', viewController.updataAccount);

module.exports = router;
