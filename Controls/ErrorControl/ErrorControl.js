const ErrorHandler = require('../../Utils/ErrorHandler');

// Error Message when Development
function sendErrorDev(err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        errorStack: err.stack
    });
}
// Error Message when Production
function sendErrorProd(err, res) {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // 1) Log Error
        console.error('Error', err);
        // send message
        res.status(500).json({
            status: 'error',
            message: 'Some Went Wrong! '
        });
    }
}
// handle Data Base Cast Error
function handleCaseErrorDB(err) {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new ErrorHandler(message, 400);
}
// handle Duplicate Fields Name
function handleDuplicateFieldsDB(err) {
    const value = err.errmsg.match(/"(.*?)"/g)[0];
    const message = `Duplicate Fidels value ${value}. Please use another Value `;
    return new ErrorHandler(message, 400);
}
// handler MongoDB validation Error
function handleValidationDB(err) {
    const error = Object.values(err.errors).reduce(
        (acc, val) => `${acc}. ${val}`
    );
    return new ErrorHandler(error, 400);
}
// handle JWT token error
function handleJWTError() {
    return new ErrorHandler('Invalid Token! Please Login Again', 401);
}
function TokenExpiredError() {
    return new ErrorHandler('Your Token Has Expired! Please Login Again', 401);
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // 500 mean internal server error
    err.status = err.status || 'error'; // 500 status 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (error.name === 'CastError') error = handleCaseErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = TokenExpiredError();

        sendErrorProd(error, res);
    }
};
