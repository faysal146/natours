const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tour Must Have Name'],
            unique: true,
            trim: true,
            maxlength: [40, 'name cannot be more then 40 characters'],
            minlength: [10, 'name sould be 10 characters or more']
            //validate: [validator.isAlpha, 'Tour name only contain characters']
        },
        slug: String,
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
            required: [true, 'Tour must have defficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'defficulty is either: easy, medium, difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            max: [5, 'rating must be below 5.0'],
            min: [1, 'rating must be above 1.0']
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'Tour Must Have Price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                // this only point to current documnet not => new document creation
                validator: function(value) {
                    return value < this.price;
                },
                message:
                    'Discount Price ({value}) should be below regular price'
            }
        },
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
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});
//mongoose middle were
// run before .save() and .create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
/*
// run after all the pre middle were finish
    tourSchema.post('save', function (doc,next) {
        console.log(doc)
    })
*/
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });
    next();
});
/*
// run after all the pre middle were finish
    tourSchema.post('find', function (doc,next) {
        console.log(doc)
        next()
    })
*/
// aggregation
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
