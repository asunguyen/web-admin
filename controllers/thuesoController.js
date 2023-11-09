const User = require("../models/user");
const authMiddl = require("../middlewares/authmidd");
const Thueso = require("../models/thueso");
const axios = require('axios');
const mongoose = require("mongoose");
const jobauto = require("../jobauto/job");
let totalRQ = 25;
const thusoController = {
  getAllAdmin: async (req, res) => {
    try {
      const user = await User.find();
      res.json({ code: 200, data: user });
    } catch (err) {
      res.json({ code: 500, error: err });
    }
  },
  getAllByUser: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
      let page = parseInt(req.query.page || 1);

      let skips = (page - 1) * 20;
      const listThueSo = await Thueso.find({ userID: req.user.id }).skip(skips).limit(20).sort({ createdAt: -1 });
      const count = await Thueso.countDocuments({ userID: req.user.id });
      if (listThueSo) {
        res.json({ code: 200, data: { data: listThueSo, totalPage: Math.ceil(count / 20) } });
      } else {
        res.json({ code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin" });
      }
    })
  },
  getOtp: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
      try {
        let code = req.body.code || req.query.code;
        let userID = req.user.id;
        const url = `http://14.225.255.45:3010/otp/${code}?token=${process.env.tokenO}`;
        const response = await axios.get(url);
        if (response && response.data && response.data.otp && response.data.otp.length > 0) {
          res.json({ code: 200, data: response.data });
          thusoController.updateDetail(userID, code, response);
        } else {
          res.json({ code: 200, data: response.data });
          thusoController.updateDetail(userID, code, response);
        }
      } catch (err) {
        console.log("lỗi lấy otp:: ", err);
      }
    })
  },
  updateDetail: async (userId, codeId, response) => {
    try {
      let user = await User.findById(userId);
      let code = codeId;
      let thueSo = await Thueso.findById(code);
      if (!thueSo || !thueSo._id) {
        thueSo = await Thueso.find({ codeID: code });
        thueSo = thueSo ? thueSo[0] : undefined;
        if (thueSo) 
        code = thueSo._id;
      }
      if (!thueSo || !thueSo._id || !user || !user._id) {
        return;
      }

      // check time
      if (thueSo && ((new Date().getTime() - new Date(thueSo.createdAt).getTime()) / 1000 > 180)) {
        if (thueSo.otp && thueSo.otp.length > 0 && thueSo.status == 1) {
          let otp = thueSo.otp.match(/\d+/);
          if (otp && otp.length > 0 && typeof otp != "string") {
            otp = otp[0];
          }
          return;
        }
      }
      if (user && thueSo && thueSo.status == 0 && (!thueSo.otp || thueSo.otp == "")) {
        if (response.data.otp && response.data.otp.length > 0 && new Date(thueSo.timeCreatePhone).getTime() < new Date(response.data.codeTime).getTime()) {
          console.log(user.username + " phoneNumber: " + thueSo.phoneNumber + " timecreate: " + thueSo.timeCreatePhone + " timeOTP: " + response.data.codeTime);
          await Thueso.findByIdAndUpdate(code, { status: 1, otp: response.data.otp, codeTime: response.data.codeTime });
        } else {
          if (thueSo.status == 0 && (new Date().getTime() - thueSo.time) / 1000 > 180) {
            const updateTS = await Thueso.findByIdAndUpdate(code, { status: 3 });
            //const userUD = await jobauto.autojob(user.username);
          }
        }
      }
    } catch (err) {
      console.log("loi:: ", err);
    }
  },
  getDetail: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
      try {
        let user = await User.findById(req.user.id);
        let code = req.body.code || req.query.code;
        let thueSo = await Thueso.findById(code);
        if (!thueSo || !thueSo._id) {
          thueSo = await Thueso.find({ codeID: code });
          thueSo = thueSo ? thueSo[0] : undefined;
          code = thueSo._id;
        }
        if (!thueSo || !thueSo._id) {
          res.json({ code: 404, error: "không tìm thấy thông tin yêu cầu otp" });
          return;
        }
        if (!user || !user._id) {
          res.json({ code: 404, error: "không tìm thấy thông tin usser" });
          return;
        }

        // check time
        if (thueSo && ((new Date().getTime() - new Date(thueSo.createdAt).getTime()) / 1000 > 180)) {
          if (thueSo.otp && thueSo.otp.length > 0 && thueSo.status == 1) {
            let otp = updateTS.otp.match(/\d+/);
            if (otp && otp.length > 0 && typeof otp != "string") {
              otp = otp[0];
            }
            res.json({ code: 200, data: { otp: otp, mess: thueSo.otp, status: thueSo.status } });
            return;
          }
        }
        if (user && thueSo && thueSo.status == 0 && (!thueSo.otp || thueSo.otp == "")) {
          const url = `http://14.225.255.45:3010/otp/${thueSo.codeID}?token=${process.env.tokenO}`;
          const response = await axios.get(url);
          if (response.data.otp && response.data.otp.length > 0 && new Date(thueSo.timeCreatePhone).getTime() < new Date(response.data.codeTime).getTime()) {
            console.log(user.username + " phoneNumber: " + thueSo.phoneNumber + " timecreate: " + thueSo.timeCreatePhone + " timeOTP: " + response.data.codeTime);
            await Thueso.findByIdAndUpdate(code, { status: 1, otp: response.data.otp, codeTime: response.data.codeTime });

            const updateTS = await Thueso.findById(code);
            if (req.query.code) {
              let otp = updateTS.otp.match(/\d+/);
              if (otp && otp.length > 0 && typeof otp != "string") {
                otp = otp[0];
              }
              res.json({ code: 200, data: { status: updateTS.status, otp: otp, mess: updateTS.otp, brand: updateTS.brand, amount: updateTS.amount } });
            } else {
              res.json({ code: 200, data: updateTS, createAt: thueSo.time });
            }

          } else {
            if (thueSo.status == 0 && (new Date().getTime() - thueSo.time) / 1000 > 180) {
              const updateTS = await Thueso.findByIdAndUpdate(code, { status: 3 });
              //const userUD = await jobauto.autojob(user.username);
              if (req.query.code) {
                res.json({ code: 200, data: updateTS, messager: "Thời gian lấy otp hết hạn" });
              } else {
                res.json({ code: 200, data: updateTS, createAt: thueSo.time, user: userUD.user });
              }
            } else {
              if (req.query.code) {
                let otp = thueSo.otp.match(/\d+/);
                if (otp && otp.length > 0 && typeof otp != "string") {
                  otp = otp[0];
                }
                res.json({ code: 200, data: { status: thueSo.status, otp: otp, mess: thueSo.otp, brand: thueSo.brand, amount: thueSo.amount } });
              } else {
                res.json({ code: 200, data: thueSo, createAt: thueSo.time, user: user });
              }

            }

          }
        } else {
          if (user && thueSo && thueSo.otp && thueSo.otp.length > 0) {
            if (req.query.code) {
              let otp = thueSo.otp.match(/\d+/);
              if (otp && otp.length > 0 && typeof otp != "string") {
                otp = otp[0];
              }
              res.json({ code: 200, data: { status: thueSo.status, otp: otp, mess: thueSo.otp, brand: thueSo.brand, amount: thueSo.amount } });
            } else {
              res.json({ code: 200, data: thueSo, createAt: thueSo.time, user: user });
            }
          } else {
            res.json({ code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin", user: user, thueso: thueSo });
          }

        }
      } catch (err) {
        res.json({ code: 502, error: err });
      }

    })
  },
  createThueSo: async (req, res) => {
    totalRQ--;
    if ( totalRQ >= 0) {
      authMiddl.verifyToken(req, res, async () => {
        try {
          const user = await User.findById(req.user.id);
          let quocgia = req.body.quocgia || req.query.quocgia;
          let dichvu = req.body.dichvu || req.query.dichvu;
          if (dichvu == "Facebook") {
            if (user && (user.username == "Tungfb999" || user.username == "nguyensu" || user.username == "luvzpast")) {
  
            } else {
              res.json({ code: 404, error: "dịch vụ tạm dừng vui lòng liên hệ admin" });
              return;
            }
          }
          let amount = 0;
          switch (dichvu) {
            case "Google":
              amount = 850;
              break;
            case "Microsoft":
              amount = 700;
              break;
            case "Discord":
              amount = 1000;
              break;
            case "Telegram":
              amount = 4000;
              break;
            case "Facebook":
              amount = 850;
              break;
            case "Whatsapp":
              amount = 3500;
              break;
            case "Cloudways":
              amount = 700;
              break;
          }
          if (user && user.amount > amount) {
            const url = `http://14.225.255.45:3010/phone/${quocgia}/${dichvu}?token=${process.env.tokenO}`;
            const response = await axios.get(url);
            if (response && response.data && response.data.phoneNumber) {
  
              if (amount > 0) {
                const dataRes = {
                  amount: amount,
                  brand: dichvu,
                  codeID: response.data.id,
                  phoneNumber: response.data.phoneNumber
                }
                if (req.query.dichvu && req.query.dichvu.length > 0) {
                  res.json({ code: 200, data: dataRes });
                } else {
                  res.json({ code: 200, data: dataRes });
                }
                const newThueso = await new Thueso({
                  codeID: response.data.id,
                  userID: new mongoose.mongo.ObjectId(user._id),
                  phoneNumber: response.data.phoneNumber,
                  brand: response.data.brand,
                  otp: '',
                  time: req.body.time || new Date().getTime(),
                  amount: amount,
                  timeCreatePhone: response.data.time || new Date()
                })
                const thueSo = await newThueso.save();
                const userUd = await User.findByIdAndUpdate(user._id, {amount: user.amount - amount});
              } else {
                res.json({ code: 404, error: "Không tìm thấy dịch vụ yêu cầu. kiểm tra lại tên dịch vụ hoặc liên hệ admin" });
              }
  
            } else {
              res.json({ code: 404, error: "dịch vụ tạm dừng vui lòng liên hệ admin" });
            }
  
          } else {
            res.json({ code: 403, error: "tài khoản không đủ tiền" });
          }
          totalRQ++;
        } catch (err) {
          res.json({ code: 502, error: err });
          totalRQ++;
        }
  
      })
    } else {
      res.json({ code: 503, error: "pending" });
    }
    
  },
  backAmount: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
      try {
        const user = await User.findById(req.user.id);
        const thueSo = await Thueso.findById(req.body.code);
        if (user && thueSo && thueSo.status == 0) {
          let pay = user.amount + thueSo.amount;
          await User.findByIdAndUpdate(req.user.id, { amount: pay });
          const userupdate = await User.findById(req.user.id);
          await Thueso.findByIdAndUpdate(req.body.code, { status: 3 });
          const thueSoUpdate = await Thueso.findById(req.body.code);
          res.json({ code: 200, data: thueSoUpdate, user: userupdate });
        } else {
          res.json({ code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin" });
        }

      } catch (err) {
        res.json({ code: 502, error: err });
      }
    });
  },
  updateThueSo: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
      try {
        const updateTS = await Thueso.findByIdAndUpdate(req.body.code, { status: 3 });
        res.json({ code: 200, data: updateTS });
      } catch (err) {
        res.json({ code: 502, error: err });
      }
    })
  }
}

module.exports = thusoController;