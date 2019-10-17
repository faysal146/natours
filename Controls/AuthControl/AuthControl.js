const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../../Models/UserModel/UserModel');
const withErrorHOF = require('../../Utils/ErrorHOF');
const ErrorHandler = require('../../Utils/ErrorHandler');

const authToken = id =>
    jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: '90d'
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
    //console.log(user);
    // if everything ok send response to the client
    const token = authToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});
