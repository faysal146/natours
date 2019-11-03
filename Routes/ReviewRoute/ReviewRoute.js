const express = require('express');
const authController = require('../../Controls/AuthController/AuthController');
const reviewController = require('../../Controls/ReviewController/ReviewController');

// margin all the route parmas
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
    .route('/')
    .get(reviewController.getAllReview)
    .post(
        authController.protectRoute,
        authController.restrictTo('user'),
        reviewController.addTourAndUserIds,
        reviewController.createReview
    );

//   /api/v1/reviews/kjdkjfkdjfkdj
reviewRouter
    .route('/:id')
    .get(reviewController.getOneReview)
    .patch(authController.protectRoute, authController.restrictTo('admin', 'user'), reviewController.updateReview)
    .delete(authController.protectRoute, authController.restrictTo('admin', 'user'), reviewController.deleteReview);

module.exports = reviewRouter;
