const Tour = require('../../Models/TourModel/TourModel');
const APIFutures = require('../../Utils/APIFutute');
const factoryHandler = require('../FactoryHandler/FactoryHandler');
const withErrorHOF = require('../../Utils/ErrorHOF');
const ErrorHandler = require('../../Utils/ErrorHandler');

// All the CRUD
exports.aliasTopTours = (req, res, next) => {
    /*
        limit post 5, 
        sort by ratingsAverage and price, 
        page amount 1, 
        selected field  => name price ratingsAverage summary
    */
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price,';
    req.query.page = 1;
    req.query.field = 'name,price,ratingsAverage,summary';
    next();
};
exports.getAllTours = withErrorHOF(async (req, res, next) => {
    const apiFutures = new APIFutures(Tour.find().populate(), req.query)
        .filtering()
        .sorting()
        .limitFields()
        .pagination();
    const tours = await apiFutures.query;

    // send the response
    res.status(200).send({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
});
// get one tour by the ID
exports.getTour = withErrorHOF(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    // handle error if tour is not found
    if (!tour) {
        return next(new ErrorHandler(`can't find tour with that ID `, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.createPost = factoryHandler.createOne(Tour);
exports.upDateTour = factoryHandler.updateOne(Tour);
exports.deleteTour = factoryHandler.deleteOne(Tour);

exports.toursStatus = withErrorHOF(async (req, res, next) => {
    const tour = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: '$difficulty',
                avgPrice: { $avg: '$price' },
                numTours: { $sum: 1 },
                numRating: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});
exports.getMountlyTour = withErrorHOF(async (req, res, next) => {
    const year = req.params.year * 1; // 2019
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-1-1`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                tourCount: { $sum: 1 },
                tourName: { $push: '$name' }
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: { tourCount: -1 }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});
