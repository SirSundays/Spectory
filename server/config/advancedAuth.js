const jwt = require("jsonwebtoken");
const User = require("../api/user/model/User");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(token, "secret");
        req.userData = decoded;
        const email = decoded.email;
        console.log(email);
        const user = await User.findOne({ email });
        const role = user.role;
        if (role === 42) {
            next();
        } else {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
    } catch (err) {
        return res.status(401).json({
            message: "Authentification Failed"
        });
    }
};