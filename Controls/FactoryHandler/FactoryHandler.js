const APIFutures = require('../../Utils/APIFutute');
const catchError = require('../../Utils/catchError');
const ErrorHandler = require('../../Utils/ErrorHandler');

exports.getAll = Model =>
    catchError(async (req, res, next) => {
        // the is for get all the review of single tour
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const apiFutures = new APIFutures(Model.find(filter).populate(), req.query)
            .filtering()
            .sorting()
            .limitFields()
            .pagination();
        const data = await apiFutures.query;

        // send the response
        res.status(200).send({
            status: 'success',
            result: data.length,
            data: {
                data
            }
        });
    });

exports.getOne = (Model, populateOptions) =>
    catchError(async (req, res, next) => {
        const query = Model.findById(req.params.id);
        if (populateOptions) query.populate(populateOptions);
        const doc = await query;
        // handle error if doc is not found
        if (!doc) {
            return next(new ErrorHandler(`can't find docmunt with that ID `, 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });

exports.deleteOne = Model =>
    catchError(async (req, res, next) => {
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
    catchError(async (req, res, next) => {
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
    catchError(async (req, res, next) => {
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
