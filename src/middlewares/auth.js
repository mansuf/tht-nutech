const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak tidak valid atau kadaluwarsa",
            data: null,
        });
    }

    token = token.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            status: 108,
            message: "Token tidak tidak valid atau kadaluwarsa",
            data: null,
        });
    }
};

module.exports = auth;
