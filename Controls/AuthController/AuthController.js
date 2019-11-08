const crypto = require('crypto');
const chalk = require('chalk');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const moment = require('moment');
const User = require('../../Models/UserModel/UserModel');
const catchError = require('../../Utils/catchError');
const ErrorHandler = require('../../Utils/ErrorHandler');
const sendMail = require('../../Utils/SendMailer');

const authToken = id => {
    // sing in user bia jwt singin
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRED
    });
};
const sendResponse = ({ res, statusCode, token, user }) => {
    const options = {
        expires: new Date(Date.now() + moment.duration(90, 'days').asMilliseconds()),
        httpOnly: true
    };
    // in production secure is enable
    if (process.env.NODE_ENV === 'production') options.secure = true;
    /*
        remove the password and active field from the response object
    */
    user.password = undefined;
    user.active = undefined;
    user.role = undefined;

    // send token via cookie
    res.cookie('token', token, options);
    // send response
    res.status(statusCode || 200).json({
        status: 'success',
        token,
        data: { user }
    });
};
exports.protectRoute = catchError(async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    // 1) getting token from authorization header and check it is valid or not
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
        // getting token from cookies
    } else if (req.cookies.token) {
        // eslint-disable-next-line prefer-destructuring
        token = req.cookies.token;
    }
    // 2) verification the token
    if (!token || !validator.isJWT(token)) {
        return next(
            new ErrorHandler(
                'you are not logged in! please login or create new Account',
                401 // unauthorization
            )
        );
    }
    // decode the token and get user info to check about user
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new ErrorHandler('user no longer exist with this token', 401));
    }
    // 4) check if user chenge password after token was issued
    if (await currentUser.passwordChangeAt(decoded.iat)) {
        return next(new ErrorHandler('User Recently Change Password Please Login Again', 401));
    }
    /*
        5) if ther is not problem continue the process 
        access grant to see Protected Router
    */
    // put user data in request
    req.user = currentUser;
    res.locals.user = currentUser;
    console.log(chalk.bgGreen.bold('current user  =>'), currentUser);
    // call the next middlewere
    next();
});
exports.restrictTo = (...roles) => {
    return catchError(async (req, res, next) => {
        // role is array of list the contains is type of user role
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Sorry You Do Not have Permision To Perfome This Action`,
                    403 // forbiten
                )
            );
        }
        // other wise call next
        next();
    });
};
exports.singUp = catchError(async (req, res, next) => {
    // todo
    // check body

    const newUser = { ...req.body };
    newUser.changePasswordAt = moment().toISOString();
    const addNewUser = await User.create(newUser);
    const token = authToken(addNewUser._id);
    sendResponse({ res, statusCode: 201, token, user: addNewUser });
});
exports.login = catchError(async (req, res, next) => {
    const { email, password } = req.body;
    // check email and password valid or not
    // min password length 6 from ==> userModel.js file
    if (!validator.isEmail(email) || !validator.isLength(password, { min: 6 })) {
        return next(new ErrorHandler('Please Provide Valid Email And Password', 400));
    }
    // check if User exists and password is correct or match
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler('Incorrect Email and Password', 401));
        // 401 mean unatuh
    }
    // if everything ok send response to the client
    const token = authToken(user._id);
    sendResponse({ res, token, user });
});
exports.isLoggedin = async (req, res, next) => {
    // 1) getting token from cookies and check it is valid or not
    if (req.cookies.token && validator.isJWT(req.cookies.token)) {
        // eslint-disable-next-line prefer-destructuring
        try {
            // 2) verification the token
            const decoded = await promisify(jwt.verify)(req.cookies.token, process.env.SECRET_KEY);

            // 3) check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                // if no user call the next middlewere and stop excuting this function
                return next();
            }
            // 4) check if user chenge password after token was issued
            if (await currentUser.passwordChangeAt(decoded.iat)) {
                // if user change his/her password stop excuted this function call the next middlewere
                return next();
            }
            /*
            if exctuing reach this line mean there is loggedin user.
            so put the loggedin user data to the res.locals object

            locals is spacial object that get access to the every pug template.
            put current user in locals object to get access user in the pug template
        */
            res.locals.user = currentUser;
            console.log(chalk.cyanBright(currentUser));
            next();
        } catch (err) {
            next();
        }
    } else {
        // if there is no cookies call the next middlewere
        next();
    }
};
exports.loggOut = (req, res, next) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};
exports.forgotPassword = catchError(async (req, res, next) => {
    // 1) get user based on posted email
    const { email } = req.body;
    if (!validator.isEmail(email)) {
        return next(new ErrorHandler('Please Provide Valid Email', 400)); // bad reqeust
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler('No Account Found With this Email', 404)); // not found
    }
    // 2) generate random token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) send email to the user with random token
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forget Your Password ?. Please Click The Link to Set New Password ${resetUrl}`;

    try {
        sendMail({
            to: user.email,
            subject: 'Your Account Reset Password Token (Valid for 10 min)',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'reset password token send to the email'
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.passwordResetExpired = undefined;
        user.save({ validateBeforeSave: false });
        return next(new ErrorHandler('There was an error to sending email, please try again later', 500));
    }
});
exports.resetPassword = catchError(async (req, res, next) => {
    // 1) get the token from params
    const { resetToken } = req.params;
    // 2 ) check there is a token
    if (!resetToken) {
        return next(new ErrorHandler('invalid token', 400));
    }
    // 3) hased the token
    const hasedToken = crypto
        .createHash('sha256')
        .update(resetToken)
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

    // 4 ) reset the new password
    const { password, confirmPassword } = req.body;
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetExpired = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    /*
         5) update the password change at propety
         this future is apply as pre middle were in ===> userModel.js
    */
    // 6) send the new token to the user
    const token = await authToken(user._id);
    sendResponse({ res, token });
});
exports.upDatePassword = catchError(async (req, res, next) => {
    /*
        const { id } = jwt.decode(req.headers.authorization.split(' ')[1]);
        1) get user from the collection by the posted id
        const user = await User.findOne({ _id: id }).select('+password');
    */
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invlid Token please Log in Again', 401));
    }
    // 2) check the new posted password match the old password
    const { currentPassword, password, confirmPassword } = req.body;
    if (!(await user.correctPassword(currentPassword, user.password))) {
        return next(new ErrorHandler(`Your Entered Password is Wrong`, 401));
    }
    // 3) upDate the password
    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save();
    // 4) Log user in send JWT token for user loged in
    const token = authToken(user._id);
    sendResponse({ res, token, user });
});
