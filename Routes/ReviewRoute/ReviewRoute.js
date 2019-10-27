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
//   /api/v1/reviews/kjdkjfkdjfkdj
reviewRouter
    .route('/:id')
    .get(reviewControl.getOneReview)
    .patch(reviewControl.updateReview)
    .delete(reviewControl.deleteReview);

module.exports = reviewRouter;
