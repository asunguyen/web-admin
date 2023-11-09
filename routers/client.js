const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middlewares/authmidd");
router.get("/", (req, res) => {
    res.render("client/home");
});
router.get("/login", (req, res) => {
    res.render("client/login");
});
router.get("/register", (req, res) => {
    res.render("client/register");
});
router.get("/dash", (req, res) => {
    res.render("client/dash");
})
router.get("/about", (req, res) => {
    res.render("client/about");
})
router.get("/deposit", (req, res) => {
    res.render("client/deposit");
})
router.get("/history-deposit", async(req, res) => {
    res.render("client/historydeposit");
})
router.get("/page404", async(req, res) => {
    res.render("client/commingsoon");
})
router.get("/thue-so-nhanh", async(req, res)=> {
    res.render("client/thuesonhanh");
})
router.get("/info-user", async(req, res)=> {
    res.render("client/userinfo");
})
router.get("/api", async(req, res)=> {
    res.render("client/apiclient");
})
router.get("/test-get-phone", async(req, res)=> {
    res.render("client/getPhone");
})

module.exports = router;