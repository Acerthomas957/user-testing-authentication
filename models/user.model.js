const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}

userSchema.methods.SignAccessToken = async function () {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN_KEY, { expiresIn: '7d'})
}

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;