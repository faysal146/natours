const Tour = require('../../Models/TourModel/TourModel');
// All the CRUD
exports.getAllPost = async (req, res) => {
    try {
        const tours = await Tour.find();
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
    //     let newTour = await new Tour(req.body);
    //     newTour = await newTour.save();
    const newTour = await Tour.create(req.body);
    try {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        console.log(err);
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
