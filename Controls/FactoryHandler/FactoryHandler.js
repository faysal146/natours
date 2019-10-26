const withErrorHOF = require('../../Utils/ErrorHOF');
const ErrorHandler = require('../../Utils/ErrorHandler');

exports.deleteOne = Model =>
    withErrorHOF(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new ErrorHandler(`can't find doc with that ID `, 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    });

exports.updateOne = Model =>
    withErrorHOF(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doc) {
            return next(new ErrorHandler(`can't find doc with that ID `, 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });

exports.createOne = Model =>
    withErrorHOF(async (req, res, next) => {
        //     let newTour = await new Tour(req.body);
        //     newTour = await newTour.save();
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
