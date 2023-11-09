const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddl = {
    verifyToken: async (req, res, next) => {
        try {
            const token = req.headers.token;
            if (token) {
                const accessToken = token.split(" ")[1];
                jwt.verify(accessToken, process.env.jwtKey, (err, user) => {
                    if (err) {
                        res.json({ code: 403, error: "Token is not valid" });
                    } else {
                        req.user = user;
                        next();
                    }

                })
            } else {
                let tokenUser = req.headers.tokenId || req.headers.tokenid;
                if (!tokenUser) {
                    tokenUser = req.query.tokenid;
                }
                if (tokenUser) {
                    const user = await User.findById(tokenUser);
                    if (user && user._id) {
                        req.user = user;
                        req.user.id = user._id;
                        next();
                    } else {
                        res.json({ code: 401, error: "You're not authenticated" });
                    }
                } else {
                    res.json({ code: 401, error: "You're not authenticated" });
                }
            }
        } catch (err) {
            res.json({ code: 500, error: err });
        }

    },
    verifyTokenAdmin: (req, res, next) => {
        authMiddl.verifyToken(req, res, () => {
            try{
                if (req.user.id == req.params.id || req.user.admin) {
                    next();
                } else {
                    res.json({ code: 403, error: "You're not allowed to delete other" });
                }
            } catch(err) {
                res.json({code: 500, error: err});
            }
        })
    }
};
module.exports = authMiddl;