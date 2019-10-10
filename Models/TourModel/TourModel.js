const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour Must Have Name'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Tour must have maxGroupSize']
    },
    difficulty: {
        type: String,
        required: [true, 'Tour must have defficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Tour Must Have Price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'tour must have summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'tour must have cover image']
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
