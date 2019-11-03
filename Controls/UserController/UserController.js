const User = require('../../Models/UserModel/UserModel');
const catchError = require('../../Utils/catchError');
const ErrorHandler = require('../../Utils/ErrorHandler');
const factoryHandler = require('../FactoryHandler/FactoryHandler');

const filterObject = (obj, field) => {
    // 1 obj should be object
    // 2 field should be array
    const upDateObj = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
        if (field.includes(key)) {
            upDateObj[key] = obj[key];
        }
    }
    return upDateObj;
};
exports.getAllTheUsers = factoryHandler.getAll(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getUser = factoryHandler.getOne(User);

exports.updateMe = catchError(async (req, res, next) => {
    // 1) check if password is change with this route
    if (req.body.password || req.body.confirmPassword) {
        return next(new ErrorHandler('sorry this route is not for changing the password please use /user/update-password route', 400));
    }
    // 2) update the user data
    const field = ['email', 'name'];
    const filterOutBody = filterObject(req.body, field);
    const upDatedUser = await User.findByIdAndUpdate(req.user.id, filterOutBody, {
        new: true,
        runValidators: true
    });
    // 3) send back the response
    res.status(200).json({
        status: 'success',
        data: { user: upDatedUser }
    });
});
exports.deleteMe = catchError(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
});
exports.addNewUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'please singup'
    });
};
exports.upDateUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'this page is under construction'
    });
};
exports.deleteUser = factoryHandler.deleteOne(User);
