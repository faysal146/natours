const Tour = require('../../Models/TourModel/TourModel');
const catchError = require('../../Utils/catchError');
//const ErrorHandler = require('../../Utils/ErrorHandler');

exports.getOverView = catchError(async (req, res, next) => {
    // 1) get all tour from the data base
    const tours = await Tour.find({});
    // 2) build the template using the data
    // 3) render the template
    res.status(200).render('OverView', {
        title: 'All Tour',
        tours
    });
});
exports.getTour = catchError(async (req, res, next) => {
    // 1) get tour from data base
    const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    // 2) build the template and render it
    res.status(200).render('Tour', {
        title: tour.name,
        tour
    });
});
