const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../../Models/UserModel/UserModel');
const withErrorHOF = require('../../Utils/ErrorHOF');
const ErrorHandler = require('../../Utils/ErrorHandler');

const authToken = id =>
    jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRED
    });

exports.singUp = withErrorHOF(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = authToken(newUser._id);
    // const user = {...newUser}
    // delete user.password
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = withErrorHOF(async (req, res, next) => {
    const { email, password } = req.body;
    // check email and password valid or not
    // min password length 6 from ==> userModel.js file
    if (
        !validator.isEmail(email) ||
        !validator.isLength(password, { min: 6 })
    ) {
        return next(
            new ErrorHandler('Please Provide Valid Email And Password', 400)
        );
    }
    // check if User exists and password is correct or match
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler('Incorrect Email and Password', 401)); // 401 mean unatuh
    }
    // if everything ok send response to the client
    const token = authToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protectRoute = withErrorHOF(async (req, res, next) => {
    let token;
    // 1) getting token and check it is valid or not
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // 2) verification the token
    if (!token || !validator.isJWT(token)) {
        return next(
            new ErrorHandler(
                'you are not logged in! please login or create new Account',
                401 // unauth
            )
        );
    }
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new ErrorHandler('user no longer exist with this token', 401)
        );
    }
    // 4) check if user chenge password after token was issued
    if (await currentUser.passwordChangeAt(decoded.iat)) {
        return next(
            new ErrorHandler(
                'User Recently Change Password Please Login Again',
                401
            )
        );
    }
    /*
        5) if ther is not problem continue the process 
        access grant to see Protected Router
    */
    // put user data in request
    req.user = currentUser;
    // call the next middlewere
    next();
});
