const crypto = require('crypto');
//const chalk = require('chalk');
const Tour = require('../../Models/TourModel/TourModel');
const User = require('../../Models/UserModel/UserModel');
const Booking = require('../../Models/BookingModel/BookingModel');
const catchError = require('../../Utils/catchError');
const ErrorHandler = require('../../Utils/ErrorHandler');

exports.getOverView = catchError(async (req, res, next) => {
    // 1) get all tour from the data base
    const tours = await Tour.find({});
    // 2) build the template using the data
    // 3) render the template
    res.status(200).render('OverView', {
        title: 'All Tour',
        tours
    });
});
exports.getTour = catchError(async (req, res, next) => {
    // 1) get tour from data base
    const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if (!tour) {
        return next(new ErrorHandler('no tour found with this name!', 404));
    }
    if (res.locals.user) {
        const bookedTour = await Booking.find({ tour: tour._id, user: res.locals.user._id });
        tour.isTourBooked = bookedTour[0];
    }
    //console.log(tour.isTourBooked)
    // 2) build the template and render it
    res.status(200).render('Tour', {
        title: tour.name,
        tour
    });
});
const sendPage = (temp, title, res) => {
    res.status(200).render(temp, { title });
};
/*
    if user is loggedin 
    hide the route /login and /singup
    redirect to home page
*/
exports.protectRouteFormAuthUser = (req, res, next) => {
    if (res.locals.user) return res.redirect('/');
    next();
};

/*
    find all tours that user was booked
*/
exports.getMyBookings = catchError(async (req, res, next) => {
    const bookin = await Booking.find({ user: req.user._id });
    const tourId = bookin.map(el => el.tour.id);
    //console.log(chalk.hex('#344ac4')('all the tourIds'), tourId);
    const tours = await Tour.find({ _id: { $in: tourId } });
    res.status(200).render('OverView', {
        title: 'Booked Tours',
        tours
    });
});
exports.validateForgetPasswordToken = catchError(async (req, res, next) => {
    // 1) get the token from params
    const { token } = req.query;
    // 2 ) check there is a token
    if (!token) {
        return next(new ErrorHandler('invalid token', 400));
    }
    // 3) hased the token
    const hasedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    // 4 ) check token is valid or has not expried
    const user = await User.findOne({
        passwordResetToken: hasedToken,
        passwordResetExpired: { $gt: Date.now() }
    });
    // 5) if no user find mean => token is not valid or time has expired
    if (!user) {
        // stop the code and send the error message
        return next(new ErrorHandler('Token is invalid or has expired', 400));
    }
    next();
});
exports.getForgetPassword = (req, res) => sendPage('ForgetPassword', 'Forget Password', res);
exports.getResetPassword = (req, res) => sendPage('ResetPassword', 'Reset Password', res);
exports.getLoginFrom = (_, res) => sendPage('Login', 'Login', res);
exports.getSingupFrom = (_, res) => sendPage('Singup', 'Singup', res);
exports.userAccount = (_, res) => sendPage('UserAccount', 'Account', res);

// ===> woring direct from submit

// exports.updataAccount = catchError(async (req, res, next) => {
//     const { email, name } = req.body;
//     const updateUser = await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             name,
//             email
//         },
//         {
//             new: true,
//             runValidators: true
//         }
//     );
//     res.status(200).render('UserAccount', {
//         user: updateUser
//     });
// });
