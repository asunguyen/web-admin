const router = require("express").Router();
const adminController = require("../controllers/adminController");

router.get("/", (req, res) => {
    res.render("client/home");
});

router.get("/login", (req, res) => {
    res.render("client/login");
});
router.get("/activepay", (req, res) => {
    res.render("admin/adminactivepay");
});

router.get("/user-list", (req, res) => {
    res.render("admin/thongkeuser");
});
router.get("/user-detail", (req, res) => {
    res.render("admin/thongkeuserdetail");
});
router.get("/dichvu", (req, res) => {
    res.render("admin/dichvu");
});

router.get("/quanly-thongbao", async(req, res)=> {
    res.render("client/thongbao");
})
router.get("/hoan-tien", async(req, res)=> {
    res.render("client/hoantien");
})

//quản lý admin
router.get("/manager/user-list", adminController.getListUser);
router.post("/manager/user-detail", adminController.getUserDetail);
router.post("/manager/create-user", adminController.createUser);
router.get("/manager/list-dichvu", adminController.getDichVu);
router.post("/manager/update-dichvu", adminController.updateDichVu);
router.post("/manager/create-dichvu", adminController.createDichVu);
router.post("/manager/info-user", adminController.userInfo);
router.post("/manager/hoantien-user", adminController.hoantienUser);
router.get("/list-pending", adminController.getListPayPending);

module.exports = router;