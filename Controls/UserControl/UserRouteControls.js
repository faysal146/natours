const User = require('../../Models/UserModel/UserModel');
const withErrorHOF = require('../../Utils/ErrorHOF');
const ErrorHandler = require('../../Utils/ErrorHandler');

const filterObject = (obj, field) => {
    // 1 obj should be obj
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

exports.getAllTheUsers = withErrorHOF(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});
exports.updateCurrentUserData = withErrorHOF(async (req, res, next) => {
    // 1) check if password is change with this route
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new ErrorHandler(
                'sorry this route is not for changing the password please use /user/update-password route',
                400
            )
        );
    }
    // 2) update the user data
    const field = ['email', 'name'];
    const filterOutBody = filterObject(req.body, field);
    const upDatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filterOutBody,
        {
            new: true,
            runValidators: true
        }
    );
    // 3) send back the response
    res.status(200).json({
        status: 'success',
        data: { user: upDatedUser }
    });
});
exports.deleteCurrentUser = withErrorHOF(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
});
exports.addNewUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'this page is under construction'
    });
};
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'this page is under construction'
    });
};
exports.upDateUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'this page is under construction'
    });
};
exports.deleteUser = withErrorHOF(async (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'this page is under construction'
    });
});
