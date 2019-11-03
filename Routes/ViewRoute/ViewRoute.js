const express = require('express');
const viewController = require('../../Controls/ViewController/ViewController');

const router = express.Router();

router.get('/', viewController.getOverView);
router.get('/tour/:tourSlug', viewController.getTour);

module.exports = router;
