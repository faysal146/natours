const express = require('express');
const tourController = require('../../Controls/TourController/TourController');
const authController = require('../../Controls/AuthController/AuthController');
const reviewRoute = require('../ReviewRoute/ReviewRoute');
// Router middlewere
const tourRouter = express.Router();

// param middle were to check id
//tourRouter.param('id', tourController.checkId);

tourRouter.use('/:tourId/reviews', reviewRoute);

tourRouter.route('/tours-status').get(tourController.toursStatus);
tourRouter
    .route('/get-mountly-tours/:year')
    .get(authController.protectRoute, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMountlyTour);

tourRouter //apply middlewere => aliasTopTours
    .route('/top-5-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.get('/tours-within/:distance/center/:latlng/unit/:unit', tourController.getTourWithIn);

tourRouter.get('/distance/:latlng/unit/:unit', tourController.getDistance);

tourRouter
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protectRoute, authController.restrictTo('admin', 'lead-guide'), tourController.createPost);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protectRoute, authController.restrictTo('admin', 'lead-guide'), tourController.upDateTour)
    .delete(authController.protectRoute, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = tourRouter;
