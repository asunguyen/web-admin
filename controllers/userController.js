const User = require("../models/user");
const Payment = require("../models/payment");
const Thueso = require("../models/thueso");
const authMiddl = require("../middlewares/authmidd");
const userController = {
    getAllUser: async(req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try{
                let page = parseInt(req.query.page || 1);
                let skips = (page - 1) * 20;
                const user = await User.find().skip(skips).limit(20).sort({ createdAt: -1 });
                const count = await User.countDocuments();
                res.json({code: 200, data: user, totalPage: Math.ceil(count / 20), total: count});
            }catch(err) {
                res.json({code: 500, error: err});
            }
        })
        
    },
    deleteUser: async(req, res) => {
        try{
            const user = await User.findById(req.params.id);
            res.json({code: 200, data: user});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    },
    getInfo: async(req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try{
                const user = await User.findById(req.user.id);
                if (user) {
                    const countRequest = await Thueso.countDocuments({userID: req.user.id});
                    const totalOTP = await Thueso.countDocuments({userID: req.user.id, status: 1});
                    const listPay = await Payment.aggregate([
                        { $match: { status: 1 } },
                        { $group: { _id: "$userID", totalAmount: { $sum: '$amount' } } }
                      ]);
                    let countPay = listPay.find((x) => x._id == req.user.id);
                    res.json({code: 200, data: user, total: {totalPay: countPay ? countPay.totalAmount : 0, totalRequest: countRequest, totalOTP: totalOTP}});
                } else {
                    res.json({code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin"});
                }
            } catch(err) {
                res.json({code: 502, error: err});
            }
            
        })
    },
    getInfoByAdmin: async(req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try {
                const user = await User.findById(req.body.id);
                if (user) {
                    const countRequest = await Thueso.countDocuments({userID: user._id});
                    const totalOTP = await Thueso.countDocuments({userID: user._id, status: 1});
                    const listPay = await Payment.aggregate([
                        { $match: { status: 1, userID: user._id } },
                        { $group: { _id: "$userID", totalAmount: { $sum: '$amount' } } }
                      ]);
                    let countPay = listPay[0];
                    let data = {
                        user: user.username,
                        amount: user.amount,
                        totalPay: countPay ? countPay.totalAmount*1000 : 0,
                        totalRequest: countRequest,
                        totalOTP: totalOTP
                    }
                    res.json({code: 200, data: data});
                } else {
                    res.json({code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin"});
                }
            } catch(err) {
                res.json({code: 502, error: err})
            }
        })
    }
}

module.exports = userController;