const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const thuesoSchema = new mongoose.Schema({
   userID: ObjectId,
   codeID: {
    type: String,
    unique: true
   },
   phoneNumber: {
    type: String
   },
   brand: {
    type: String
   },
   status: {
    type: Number,
    default: 0
   },
   otp: {
    type: String
   },
   time: {
      type: String
   },
   timeCreatePhone: {
      type: String
   },
codeTime: {
	type: String
},
   amount: {
      type: Number
   }

}, {timestamps: true});

module.exports = mongoose.model("thueso", thuesoSchema);

