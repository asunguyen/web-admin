const thuesoController = require("../controllers/thuesoController");

const router = require("express").Router();

//get all
router.get("/", thuesoController.getAllAdmin);
router.get("/list", thuesoController.getAllByUser);
router.post("/detail", thuesoController.getDetail);
router.post("/create", thuesoController.createThueSo);
router.post("/back", thuesoController.backAmount);
router.post("/update-stt", thuesoController.updateThueSo);
router.get("/detail", thuesoController.getOtp);
router.get("/create", thuesoController.createThueSo);

module.exports = router;