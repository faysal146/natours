const Review = require('../../Models/ReviewModel/ReviewModel');
const factoryHandler = require('../FactoryHandler/FactoryHandler');
const Tour = require('../../Models/TourModel/TourModel');
const catchError = require('../../Utils/catchError');
const ErrorHandler = require('../../Utils/ErrorHandler');

exports.addTourAndUserIds = catchError(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) {
        return next(new ErrorHandler('no tour found with this id', 404));
    }

    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    // req.body.tour = req.params.tourId;
    // req.body.user = req.user.id;
    next();
});

exports.getAllReview = factoryHandler.getAll(Review);
exports.getOneReview = factoryHandler.getOne(Review);
exports.createReview = factoryHandler.createOne(Review);
exports.deleteReview = factoryHandler.deleteOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
