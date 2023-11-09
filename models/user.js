const { Double } = require('mongodb');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        default: 0
    },
    rqExp: {
        type: Number,
        default: 0
    },
    rqOk: {
        type: Number,
        default: 0
    },
    amountExp: {
        type: Number,
        default: 0
    },
    amountOk: {
        type: Number,
        default: 0
    }

}, {timestamps: true});

module.exports = mongoose.model("user", userSchema);

