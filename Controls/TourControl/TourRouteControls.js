const Tour = require('../../Models/TourModel/TourModel');
const APIFutures = require('../../Utils/APIFutute');

// All the CRUD
exports.aliasTopTours = async (req, res, next) => {
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

exports.getAllPost = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).send({
            status: 'fail',
            message: err
        });
    }
};
exports.createPost = async (req, res) => {
    try {
        //     let newTour = await new Tour(req.body);
        //     newTour = await newTour.save();
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
exports.upDateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
exports.toursStatus = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getMountlyTour = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
