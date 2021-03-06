const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const moment = require('moment');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression')
//const chalk = require('chalk');

const tourRouter = require('./Routes/TourRoute/TourRoute');
const userRouter = require('./Routes/UserRoute/UserRoute');
const reviewRouter = require('./Routes/ReviewRoute/ReviewRoute');
const viewRouter = require('./Routes/ViewRoute/ViewRoute');
const bookingsRoute = require('./Routes/BookingsRoute/BookingsRoute');
const ErrorHandler = require('./Utils/ErrorHandler');
const globalErrorControl = require('./Controls/ErrorController/ErrorController');

const app = express();

// templating engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));
// serve static file to the client
app.use(express.static(path.join(__dirname, 'public')));

// set HTTP secure header
app.use(helmet());

// limiting rate of the request from same ip
const limiter = rateLimit({
    windowMs: moment.duration(1, 'hours').asMilliseconds(),
    max: 100,
    message: 'Too many request from this ip. please try again in an hour '
});
app.use('/api', limiter);

// data Sanitize against noSQL query injections
app.use(mongoSanitize());

// data Sanitize against cross side scripting attack
app.use(xss());

// preventing parameter pollutions
const whitelist =  ['ratingsAverage', 'ratingsQuantity', 'createAt', 'startDates', 'duration', 'price', 'difficulty']
app.use(hpp({ whitelist }));

// when development log url in the console
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// all of the body perser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// compress the response
app.use(compression())

// test middle were
// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     console.log(chalk.blueBright('cookies..'), req.cookies);
//     next();
// });
// console.log(chalk.rgb(255, 100, 50).bold(process.env.NODE_ENV));

// Route Middle were
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingsRoute);
app.use('/', viewRouter);

// unhandle route
app.all('*', (req, res, next) => {
    /*
        handler error with custom error handler

        in next function if we pass any argument 
        it is automatic call the global error
        and skip all other middlewere
    */
    next(new ErrorHandler(`can't find ${req.originalUrl} in the server !`, 404));
});
// global error hander
app.use(globalErrorControl);

module.exports = app;
