const Tour = require('../../Models/TourModel/TourModel');
const User = require('../../Models/UserModel/UserModel');
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
    // 2) build the template and render it
    res.status(200).render('Tour', {
        title: tour.name,
        tour
    });
});
const sendPage = (temp, res) => {
    res.status(200).render(temp, {
        title: 'Login'
    });
};
exports.getLoginFrom = (_, res) => sendPage('Login', res);
exports.getSingupFrom = (_, res) => sendPage('Singup', res);
exports.userAccount = (_, res) => sendPage('UserAccount', res);

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
