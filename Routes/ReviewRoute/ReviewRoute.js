const express = require('express');
const authControl = require('../../Controls/AuthControl/AuthControl');
const reviewControl = require('../../Controls/ReviewControl/ReviewControl');

// margin all the route parmas
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
    .route('/')
    .get(authControl.protectRoute, reviewControl.getAllReview)
    .post(
        authControl.protectRoute,
        authControl.restrictTo('user'),
        reviewControl.addTourAndUserIds,
        reviewControl.createReview
    );
//   /api/v1/reviews   in the app
reviewRouter
    .route('/:id')
    .delete(reviewControl.deleteReview)
    .patch(reviewControl.updateReview);

module.exports = reviewRouter;
