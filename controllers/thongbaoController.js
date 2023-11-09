const Thongbao = require("../models/thongbaoModel");
const authMiddl = require("../middlewares/authmidd");
const thongbaoController = {
    getAll: async (req, res) => {
        try {
            const notice = await Thongbao.find();
            res.json({ code: 200, data: notice });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    getAllActive: async (req, res) => {
        try {
            const notice = await Thongbao.find({status: true});
            res.json({ code: 200, data: notice });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    updateThongbao: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try{
                const noticeUpdate = await Thongbao.findByIdAndUpdate(req.body._id, {title: req.body.title, content: req.body.content, status: req.body.status});
                res.json({ code: 200, data: noticeUpdate });
            }catch(err) {
                res.json({ code: 500, error: err });
            }
        })
    },
    createThongbao: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try{
                const noticeCreate = await new Thongbao({
                    title: req.body.title,
                    content: req.body.content
                });
                const notice = await noticeCreate.save();
                res.json({ code: 200, data: notice });
            }catch(err) {
                res.json({ code: 500, error: err });
            }
        })
    },
    deleteThongbao: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try{
                const noticeUpdate = await Thongbao.findByIdAndUpdate(req.body._id, {status: false});
                res.json({ code: 200, data: noticeUpdate });
            }catch(err) {
                res.json({ code: 500, error: err });
            }
        })
    },
    activeThongbao: async(req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try{
                const noticeUpdate = await Thongbao.findByIdAndUpdate(req.body._id, {status: true});
                res.json({ code: 200, data: noticeUpdate });
            }catch(err) {
                res.json({ code: 500, error: err });
            }
        })
    }

}

module.exports = thongbaoController;