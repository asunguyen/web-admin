const User = require("../models/user");
const Payment = require("../models/payment");
const Thueso = require("../models/thueso");
const authMiddl = require("../middlewares/authmidd");
const jobauto = require("../jobauto/job");
const adminController = {
    getListUser: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getUserDetail: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    createUser: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getDichVu: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    updateDichVu: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    createDichVu: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getPayment: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getListPayPending: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try {
                const listPending = await Payment.find({status: 0}).sort({ createdAt: -1 });
                res.json({code: 200, data: listPending});
            } catch(err) {
                res.json({code: 500, error: err});
            }
        })
    },
    userInfo: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try {
                let username = req.body.username;
                console.log("admin user info:: ", username);
                const data = await jobauto.autojob(username)
                if (data && data.user) {
                    const { password, ...others } = data.user._doc;
                    
                    let dataRes = {
                        user: { ...others },
                        amount: data.soduvi,
                        totalPayUser: data.totalPayUser,
                        totalRequest: data.infoThueSo,
                    }
                    res.json({ code: 200, data: dataRes });
                } else {
                    res.json({ code: 404, error: "không tìm thấy thông tin user có username: " + username });
                }
            } catch (err) {
                res.json({ code: 502, error: err });
            }

        })
    },
    hoantienUser: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try {
                let username = req.body.username;
                const data = await jobauto.autojob(username);
                if (data && data.user && data.user._id) {
                    res.json({code: 200, data: data.user});
                } else {
                    res.json({ code: 404, error: "Không tìm thấy user có username: " + username });
                }
            } catch (err) {
                res.json({ code: 502, error: err });
            }
        })
    }
}

module.exports = adminController;