const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            trim: true,
            required: [true, 'Review can not be empty']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong Tour']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong a User']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewsSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'tour',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewsSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user'
    });
    next();
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;
