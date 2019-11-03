const express = require('express');
const viewController = require('../../Controls/ViewController/ViewController');
const authController = require('../../Controls/AuthController/AuthController');

const router = express.Router();

router.use(authController.isLoggedin);

router.get('/', viewController.getOverView);
router.get('/tour/:tourSlug', viewController.getTour);
router.get('/login', viewController.getLoginFrom);
router.get('/singup', viewController.getSingupFrom);

module.exports = router;
