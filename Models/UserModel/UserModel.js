const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const moment = require('moment');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name'],
        trim: true,
        minlength: [3, 'name must atlest 3 characters'],
        validate: {
            validator() {
                return !/\d/g.test(this.name);
            },
            message: 'name only contain alpha value'
        }
    },
    email: {
        type: String,
        required: [true, 'Please Enter Your Email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please Enter Valid Email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password'],
        minlength: [6, 'Password atleast {{VALUE}} characters'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please Confirm Your Password'],
        validate: {
            validator(cp) {
                return cp === this.password;
            },
            message: `Password Don't Match`
        }
    },
    changePasswordAt: Date,
    passwordResetToken: String,
    passwordResetExpired: Date,
    createdAt: {
        type: String,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});
// encrypt the password
userSchema.pre('save', async function(next) {
    // run if password modified
    if (!this.isModified('password')) return next();
    //  hash or encrypt the password
    this.password = await bcrypt.hash(this.password, 12);
    // remove confirm password field from data base
    this.confirmPassword = undefined;
});
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }
    // for - 1000mil sec because some time it is happen after
    this.changePasswordAt = Date.now() - 1000;
    next();
});
userSchema.pre('find', function(next) {
    this.find({ active: { $ne: false } });
    next();
});
//instents methood
// bycrypt password and compare
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangeAt = async function(JWTTimeStamp) {
    if (this.changePasswordAt) {
        const changeTimpStamp = parseInt(this.changePasswordAt.getTime() / 1000, 10);
        // 100 < 200 // true mean password change
        return JWTTimeStamp < changeTimpStamp;
    }
    //false mean password not change ;
    return false;
};

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // after 10 min password is expried
    this.passwordResetExpired = moment.now() + moment.duration(10, 'minute').asMilliseconds();
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
