const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const thuesoBackupSchema = new mongoose.Schema({
   userID: ObjectId,
   codeID: {
      unique: true,
    type: String
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

module.exports = mongoose.model("thuesoBackup", thuesoBackupSchema);

