const Tour = require('../../Models/TourModel/TourModel');
const factoryHandler = require('../FactoryHandler/FactoryHandler');
const catchError = require('../../Utils/catchError');
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
/*
    /tours-within/:distance/center/:latlng/unit/:unit
    /tours-within/400/center/34.0207305,-118.6919313/unit/mi
*/
exports.getTourWithIn = catchError(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    // radius mails ro kilometer
    const radius = unit === 'ml' ? distance / 3963.2 : distance / 6371;
    if (!lat || !lng) {
        return next(new ErrorHandler('Please Provide Latitude  and Longitude in formate of lat, lng', 400));
    }
    const tour = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius]
            }
        }
    });

    res.status(200).json({
        status: 'success',
        result: tour.length,
        data: {
            data: tour
        }
    });
});
// '/distance/:latlng/unit/:unit'
exports.getDistance = catchError(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    // radius mails ro kilometer
    const multiplier = unit === 'ml' ? 0.000621371 : 0.001;
    if (!lat || !lng) {
        return next(new ErrorHandler('Please Provide Latitude  and Longitude in formate of lat, lng', 400));
    }
    const distance = await Tour.aggregate([
        {
            $geoNear: {
                near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distance
        }
    });
});

exports.getAllTours = factoryHandler.getAll(Tour);
exports.getTour = factoryHandler.getOne(Tour, { path: 'reviews' });
exports.createPost = factoryHandler.createOne(Tour);
exports.upDateTour = factoryHandler.updateOne(Tour);
exports.deleteTour = factoryHandler.deleteOne(Tour);

exports.toursStatus = catchError(async (req, res, next) => {
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
exports.getMountlyTour = catchError(async (req, res, next) => {
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
