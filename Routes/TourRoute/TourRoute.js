const express = require('express');
const tourRouterControls = require('../../Controls/TourControl/TourRouteControls');
const authControl = require('../../Controls/AuthControl/AuthControl');
const reviewRoute = require('../ReviewRoute/ReviewRoute');
// Router middlewere
const tourRouter = express.Router();

// param middle were to check id
//tourRouter.param('id', tourRouterControls.checkId);

tourRouter.use('/:tourId/reviews', reviewRoute);

tourRouter.route('/tours-status').get(tourRouterControls.toursStatus);
tourRouter
    .route('/get-mountly-tours/:year')
    .get(
        authControl.protectRoute,
        authControl.restrictTo('admin', 'lead-guide', 'guide'),
        tourRouterControls.getMountlyTour
    );

tourRouter //apply middlewere => aliasTopTours
    .route('/top-5-tours')
    .get(tourRouterControls.aliasTopTours, tourRouterControls.getAllTours);

tourRouter
    .route('/')
    .get(tourRouterControls.getAllTours)
    .post(
        authControl.protectRoute,
        authControl.restrictTo('admin', 'lead-guide'),
        tourRouterControls.createPost
    );

tourRouter
    .route('/:id')
    .get(tourRouterControls.getTour)
    .patch(
        authControl.protectRoute,
        authControl.restrictTo('admin', 'lead-guide'),
        tourRouterControls.upDateTour
    )
    .delete(
        authControl.protectRoute,
        authControl.restrictTo('admin', 'lead-guide'),
        tourRouterControls.deleteTour
    );

module.exports = tourRouter;
