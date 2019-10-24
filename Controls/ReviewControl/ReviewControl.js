const moment = require('moment');
const Review = require('../../Models/ReviewModel/ReviewModel');
const withErrorHOF = require('../../Utils/ErrorHOF');
const ErrorHandler = require('../../Utils/ErrorHandler');

exports.getAllReview = withErrorHOF(async (req, res, next) => {
    const reviews = await Review.find({});

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
exports.createReview = withErrorHOF(async (req, res, next) => {
    const review = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });
});
exports.deleteReview = withErrorHOF(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
        return next(
            new ErrorHandler('sorry review is not found by given id ', 400)
        );
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});
exports.updateReview = withErrorHOF(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });
    if (!review) {
        return next(
            new ErrorHandler('sorry review is not found by given id ', 400)
        );
    }

    res.status(200).json({
        status: 'success',
        data: { review }
    });
});
