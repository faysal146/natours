const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour Must Have Name'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Tour Must Have Price']
    },
    rating: {
        type: Number,
        default: 4.5
    }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;