const paymentCtrl = require("../controllers/paymentController");

const router = require("express").Router();

//get all
router.get("/", paymentCtrl.getAll);
router.get("/:id", paymentCtrl.getAllByUser);
router.get("/info-code/:code", paymentCtrl.getInfoByCode);
router.post("/create-deposit", paymentCtrl.createDeposit);
router.post("/active-deposit", paymentCtrl.activeDeposit);
router.put("/:id", paymentCtrl.activeDeposit);
router.post("/delete-deposit", paymentCtrl.deletePayment);
module.exports = router;
