const Review = require('../../Models/ReviewModel/ReviewModel');
const withErrorHOF = require('../../Utils/ErrorHOF');
const ErrorHandler = require('../../Utils/ErrorHandler');
const factoryHandler = require('../FactoryHandler/FactoryHandler');

exports.getAllReview = withErrorHOF(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});
exports.getOneReview = withErrorHOF(async (req, res, next) => {
    const id = req.params.id * 1;
    const review = await Review.findById(id);
    if (!review) {
        return next(new ErrorHandler('no review found with this id', 400));
    }
    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
});
exports.addTourAndUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.createReview = factoryHandler.createOne(Review)
exports.deleteReview = factoryHandler.deleteOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
