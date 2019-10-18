const Tour = require('../../Models/TourModel/TourModel');
const APIFutures = require('../../Utils/APIFutute');
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
    const apiFutures = new APIFutures(Tour.find(), req.query)
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
exports.createPost = withErrorHOF(async (req, res, next) => {
    //     let newTour = await new Tour(req.body);
    //     newTour = await newTour.save();
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
});
exports.getTour = withErrorHOF(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
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
exports.upDateTour = withErrorHOF(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
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
exports.deleteTour = withErrorHOF(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new ErrorHandler(`can't find tour with that ID `, 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});
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
