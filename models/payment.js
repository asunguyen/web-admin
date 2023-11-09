const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    userID: {
        type: ObjectId,
        require: true
    },
    status: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    cupon: {
        type: Number,
        default: 0
    }

}, {timestamps: true});

module.exports = mongoose.model("payment", paymentSchema);

