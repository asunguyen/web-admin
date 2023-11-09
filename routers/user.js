const userController = require("../controllers/userController");

const router = require("express").Router();

//get all
router.get("/", userController.getAllUser);
router.get("/get-info", userController.getInfo);
router.delete("/:id", userController.deleteUser);
router.post("/admin-user", userController.getInfoByAdmin);

module.exports = router;
