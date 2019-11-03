const mongoose = require('mongoose');
const Tour = require('../TourModel/TourModel');

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
// index and achive the uniqueness
reviewsSchema.index({ user: 1, tour: 1 }, { unique: true });

// the query middlewere for vaitule populated user field
reviewsSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: { name: 1, photo: 1 }
    });
    next();
});

// mongoose static method
// calculatin tour avg rating
reviewsSchema.statics.calcAvgRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                ratingsQuantity: { $sum: 1 },
                ratingsAverage: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        const { ratingsQuantity, ratingsAverage } = stats[0];
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage,
            ratingsQuantity
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        });
    }
};

reviewsSchema.post('save', function() {
    this.constructor.calcAvgRatings(this.tour); //  tour id
});

// findByIdAndUpdate
// findByIdAndDelete
reviewsSchema.pre(/findOneAnd/, async function(next) {
    this.reviewUpdate = await this.findOne();
    next();
});
reviewsSchema.post(/findOneAnd/, async function() {
    // await this.findOne(); does not work in here
    await this.reviewUpdate.constructor.calcAvgRatings(this.reviewUpdate.tour);
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;
