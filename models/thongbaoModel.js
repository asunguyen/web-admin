const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const thongbaoSchema = new mongoose.Schema({
   title: {
    type: String
   },
   content: {
    type: String
   },
   status: {
    type: Boolean,
    default: true
   }

}, {timestamps: true});

module.exports = mongoose.model("thongbao", thongbaoSchema);

