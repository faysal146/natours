const catchError = require('../../Utils/catchError');

// Error Message when Development
const sendErrorDev = (err, req, res) => {
    // start with (api) thats mean it is api error
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        errorStack: err.stack
    });
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            errorStack: err.stack
        });
    } else {
        // not start with (api) mean render error
        res.status(err.statusCode).render('Error', {
            title: 'someting went wrong..',
            message: err.message
        });
    }
};

// Error Message when Production
function sendErrorProd(err, req, res) {
    /* in productions mode
        url start with ( /api ) mean it is api error
        send message via json */
    if (req.originalUrl.startsWith('/api')) {
        //  if it operational error send error message to the client
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            // 1) Log Error
            console.error('Error', err);
            /*
                if it not operational error mean it is server error
                for security perpose and user expression send user friendly message
            */
            res.status(500).json({
                status: err.status,
                message: 'Someting went wrong'
            });
        }
    } else {
        /*  if not start with (/api) that mean
             we need to render the error page */
        if (err.isOperational) {
            res.status(err.statusCode).render('Error', {
                title: 'Error! Something went wrong',
                message
            });
        } else {
            // 1) Log Error
            console.error('Error', err);
            /*  if it not operational error mean it is server error
                for security perpose and user expression send user friendly message */
            res.status(500).render('Error', {
                title: 'Error! Something went wrong',
                message: 'Someting went wrong'
            });
        }
    }
}
// handle Data Base Cast Error
function handleCaseErrorDB(err) {
    const message = `Invalid ${err.path} : ${err.value}`;
    return catchError(message, 400);
}
// handle Duplicate Fields Name
function handleDuplicateFieldsDB(err) {
    const value = err.errmsg.match(/"(.*?)"/g)[0];
    const message = `Duplicate Fidels value ${value}. Please use another Value `;
    return catchError(message, 400);
}
// handler MongoDB validation Error
function handleValidationDB(err) {
    const error = Object.values(err.errors).reduce((acc, val) => `${acc}. ${val}`);
    return catchError(error, 400);
}
// handle JWT token error
function handleJWTError() {
    return catchError('Invalid Token! Please Login Again', 401);
}
function tokenExpiredError() {
    return catchError('Your Token Has Expired! Please Login Again', 401);
}
// err or 4 parmeter middlewere is found in express automtic take as error
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // 500 mean internal server error
    err.status = err.status || 'error'; // 500 status 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (error.name === 'CastError') error = handleCaseErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = tokenExpiredError();
        sendErrorProd(error, req, res);
    }
};
