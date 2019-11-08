const multer = require('multer');
const jimp = require('jimp');
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

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, callBack) => {
    if (file.mimetype.startsWith('image')) {
        callBack(null, true);
    } else {
        callBack(new ErrorHandler('Not an image ! please upload only image file', 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

exports.resizePhoto = catchError(async (req, res, next) => {
    if (!req.file) return next();

    const [, ext] = req.file.mimetype.split('/');

    req.file.filename = `user-${req.user.id}-${Date.now()}.${ext}`;

    const img = await jimp.read(req.file.buffer);
    img.resize(500, 500).write(`public/img/users/${req.file.filename}`);
    next();
});

exports.uploadUserPhoto = upload.single('photo');
exports.getAllTheUsers = factoryHandler.getAll(User);
exports.getUser = factoryHandler.getOne(User);
exports.deleteUser = factoryHandler.deleteOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMyAccount = catchError(async (req, res, next) => {
    console.log('multer file ===> ', req.file);
    console.log('multer body ===> ', req.body);
    // 1) check if password is change with this route
    if (req.body.password || req.body.confirmPassword) {
        return next(new ErrorHandler('sorry this route is not for changing the password please use /user/update-password route', 400));
    }
    // 2) update the user data
    const field = ['email', 'name'];
    const filterOutBody = filterObject(req.body, field);
    if (req.file) filterOutBody.photo = req.file.filename;
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
