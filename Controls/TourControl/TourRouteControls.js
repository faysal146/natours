const Tour = require('../../Models/TourModel/TourModel');
// All the CRUD
exports.getAllPost = async (req, res) => {
    try {
        console.log(req.query);
        // 1) filtering query base
        const queryObj = { ...req.query };
        const exclude = ['limit', 'sort', 'page', 'fields'];
        exclude.forEach(q => delete queryObj[q]);
        //2) filtering range
        // gte, gt , lte, lt => $gte, $gt, $lte, $lt
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        queryStr = JSON.parse(queryStr);
        const query = Tour.find(queryStr);

        const tours = await query;
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
