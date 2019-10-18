const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routes/TourRoute/TourRoute');
const userRouter = require('./Routes/UserRoute/UserRoute');
const ErrorHandler = require('./Utils/ErrorHandler');
const globalErrorHandler = require('./Controls/ErrorControl/ErrorControl');


//console.log(process.env.NODE_ENV);

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// parse the body from request
app.use(express.json());
// serve static file to the cleint
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Route Middle were
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// unhandle route
app.all('*', (req, res, next) => {
    /*
        handler error with custom error handler

        in next function if we pass any argument 
        it is automatic call the global error
        and skip all other middlewere
    */
    next(
        new ErrorHandler(`can't find ${req.originalUrl} in the server !`, 404)
    );
    /*
        res.status(404).json({
            status: 'fail',
            message: `can't find ${req.originalUrl} in the server !`
        });
    */
    /*
        const err = new Error(`can't find ${req.originalUrl} in the server !`);
        err.statusCode = 404; // 404 not found
        err.status = 'fail'; // 404 status 'fail
        next(err)
    */
});
// global error handle

app.use(globalErrorHandler);

module.exports = app;
