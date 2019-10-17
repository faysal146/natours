const User = require('../../Models/UserModel/UserModel');
const withErrorHOF = require('../../Utils/ErrorHOF');

exports.getAllTheUsers = withErrorHOF(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
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
