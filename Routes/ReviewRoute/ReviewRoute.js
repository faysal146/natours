const express = require('express');
const auth = require('../../Controls/AuthControl/AuthControl');
const reviewControl = require('../../Controls/ReviewControl/ReviewControl');

const reviewRouter = express.Router();

reviewRouter
    .route('/')
    .get(auth.protectRoute, reviewControl.getAllReview)
    .post(
        auth.protectRoute,
        auth.restrictTo('user'),
        reviewControl.createReview
    );
// router
//     .route('/:id')
//     .get(auth.protectRoute, reviewControl.getOneReview)
//     .patch(auth.protectRoute, reviewControl.updateReview)
//     .delete(auth.protectRoute, reviewControl.deleteReview);

module.exports = reviewRouter;
