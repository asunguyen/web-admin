const User = require("../models/user");
const Payment = require("../models/payment");
const authMiddl = require("../middlewares/authmidd");
const mongoose = require("mongoose");
const paymentCtrl = {
    createDeposit: async(req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const user = await User.findById(req.user.id);
                const bodyData = req.body;
                if (user) {
                    const newPay = await new Payment({
                        userID: new mongoose.mongo.ObjectId(user._id),
                        amount: bodyData.amount,
                        code: bodyData.code
                    });
                    const paydeposit = await newPay.save();
                    res.json({code: 200, data: paydeposit});
                } else {
                    res.json({code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin"});
                }
            } catch(err) {
                res.json({code: 500, error: err});
            }
            
        })
    },
    getAll: async(req, res) => {
        try{
            const user = await User.find();
            res.json({code: 200, data: user});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    },
    getAllByUser: async(req, res) => {
        try{
            const user = await Payment.find({userID: req.params.id});
            res.json({code: 200, data: user});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    },
    getInfoByCode: async(req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async() => {
            try{
                const payInfo = await Payment.find({code: req.params.code});
                res.json({code: 200, data: payInfo});
            } catch(err) {
                res.json({code: 500, error: err});
            }
        }) 
        
    },
    activeDeposit: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try {
                let payInfo = await Payment.find({code: req.body.code});
                if (payInfo && payInfo.length > 0 && payInfo[0].status == 0) {
                    let user = await User.findById(payInfo[0].userID);
                    const cupon = req.body.cupon ? (payInfo[0].amount * req.body.cupon / 100) : 0;
                    console.log(cupon);
                    const totalPay = (payInfo[0].amount + cupon) * 1000;
                    const amountNew = user.amount + (payInfo[0].amount + cupon) * 1000;
                    const updatePay = await Payment.findOneAndUpdate({code: req.body.code}, {$set: {status: 1, cupon: cupon, totalPay: totalPay}});
                    const updateUser = await User.findOneAndUpdate({_id: user._id}, {$set: {amount: amountNew}});
                    res.json({code: 200});
                } else {
                    res.json({code: 500, error: "Giao dịch đã kích hoạt"});
                }
                
            } catch(err){
                res.json({code: 500, error: err});
            }
        })
    },
    deletePayment: async (req, res) => {
        try{
            authMiddl.verifyTokenAdmin(req, res, async() => {
                const deletePay = await Payment.findByIdAndDelete(req.body.id);
                res.json({code: 200});
            });
        } catch(err) {
            res.json({code: 500, error: err});
        }
    }
}

module.exports = paymentCtrl;