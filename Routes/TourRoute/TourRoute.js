const express = require('express');
const tourRouterControls = require('../../Controls/TourControl/TourRouteControls');

const tourRouter = express.Router();

//tourRouter.param('id', tourRouterControls.checkId);

tourRouter.route('/tours-status').get(tourRouterControls.toursStatus);
tourRouter
    .route('/get-mountly-tours/:year')
    .get(tourRouterControls.getMountlyTour);

tourRouter //apply middlewere => aliasTopTours
    .route('/top-5-tours')
    .get(tourRouterControls.aliasTopTours, tourRouterControls.getAllPost);

tourRouter
    .route('/')
    .get(tourRouterControls.getAllPost)
    .post(tourRouterControls.createPost);

tourRouter
    .route('/:id')
    .get(tourRouterControls.getTour)
    .patch(tourRouterControls.upDateTour)
    .delete(tourRouterControls.deleteTour);

module.exports = tourRouter;
