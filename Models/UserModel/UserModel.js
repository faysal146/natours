const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    photo: String,
    password: {
        type: String,
        required: [true, 'Please Enter Your Password'],
        minlength: [6, 'Password atleast 8 characters'],
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
//instents methood
// bycrypt password and compare
userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
