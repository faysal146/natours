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
        // parent refrancing
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

// the query middlewere for vaitule populated user field
reviewsSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: { name: 1, photo: 1 }
    });
    next();
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;
