const Review = require('../../Models/ReviewModel/ReviewModel');
const factoryHandler = require('../FactoryHandler/FactoryHandler');
// const withErrorHOF = require('../../Utils/ErrorHOF');
// const ErrorHandler = require('../../Utils/ErrorHandler');

exports.addTourAndUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllReview = factoryHandler.getAll(Review)
exports.getOneReview = factoryHandler.getOne(Review)
exports.createReview = factoryHandler.createOne(Review)
exports.deleteReview = factoryHandler.deleteOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
