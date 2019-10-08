const express = require('express');
const tourRouterControls = require('../Controls/TourRouteControls');

const tourRouter = express.Router();

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