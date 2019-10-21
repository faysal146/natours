const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const moment = require('moment');
const helmet = require('helmet');

const tourRouter = require('./Routes/TourRoute/TourRoute');
const userRouter = require('./Routes/UserRoute/UserRoute');
const ErrorHandler = require('./Utils/ErrorHandler');
const globalErrorHandler = require('./Controls/ErrorControl/ErrorControl');

//console.log(process.env.NODE_ENV);
const app = express();
// set HTTP secure header
app.use(helmet());

// limiting rate of request from same ip
const limiter = rateLimit({
    windowMs: moment.duration(1, 'hours').asMilliseconds(),
    max: 100,
    message: 'too many request from this ip. please try again in an hour '
});
app.use('/api', limiter);

// development loggin to the console
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// parse the body from request in req.body
app.use(express.json());
// serve static file to the cleint
app.use(express.static(`${__dirname}/public`));

// test middle were
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
});
// global error hander
app.use(globalErrorHandler);

module.exports = app;
