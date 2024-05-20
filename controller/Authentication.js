const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    console.log(token);
    const refreshToken = req.cookies.refreshToken;

    try {
        if (!token) {
            if (!refreshToken) {
                return res.status(403).send("Forbidden: No refresh token");
            } else {
                const user = await jwt.verify(refreshToken, "my-secret");
                const newToken = jwt.sign(
                    { id: user.id, username: user.username },
                    "my-secret",
                    { expiresIn: "2h" }
                );
                res.cookie("token", newToken, { httpOnly: true, secure: true });
                req.user = user;
                next();
            }
        } else {
            const user = await jwt.verify(token, "my-secret");
            req.user = user;
            next();
        }
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).send("Forbidden: Invalid token");
    }
}


module.exports = authenticateToken