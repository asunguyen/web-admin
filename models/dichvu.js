const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const dichvuSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   brand: {
    type: String,
    required: true
   },
   status: {
    type: Number,
    default: 1
   },
   amount: {
    type: Number,
    required: true
   }

}, {timestamps: true});

module.exports = mongoose.model("thueso", dichvuSchema);

