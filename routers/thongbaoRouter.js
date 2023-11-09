const thongbaoController = require("../controllers/thongbaoController");

const router = require("express").Router();

//get all
router.get("/", thongbaoController.getAll);
router.get("/active", thongbaoController.getAllActive);
router.post("/create-thongbao", thongbaoController.createThongbao);
router.post("/update-thongbao", thongbaoController.updateThongbao);
router.post("/delete-thongbao", thongbaoController.deleteThongbao);
router.post("/active-thongbao", thongbaoController.activeThongbao);
module.exports = router;
