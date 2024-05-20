const express = require("express")
const login = express.Router()
const logger = require("../logs/logger")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conn = require("../config/dbconfig")

login.post("/", async (req, res) => {
    try {
        const token = req.cookies.token;
        const refreshToken = req.cookies.refreshToken;

        if (!token) {
            if (!refreshToken) {
                const { username, password } = req.body;
                conn.query(
                    "SELECT id, name, password FROM login WHERE username = ? LIMIT 1",
                    [username],
                    async (err, result) => {
                        if (err) {
                            await logger.error({
                                Route:"/login",
                                Method : "POST",
                                IPAddress:req.ip,
                                Error : err,
                                Description: "Error Inside login at database query getting data:",
                                About:"No token and No refresh Token",
                                username:req.body.username
                            });
                            return res.status(500).send({
                                error: true,
                                message: "Internal Server Error",
                            });
                        }

                        if (result.length > 0) {
                            if (await bcrypt.compare(password, result[0].password)) {
                                const accessToken = jwt.sign(
                                    { id: result[0].id, username: result[0].username },
                                    "my-secret",
                                    { expiresIn: "1h" }
                                );
                                const refreshToken = jwt.sign(
                                    { id: result[0].id, username: result[0].username },
                                    "my-secret",
                                    { expiresIn: "2h" }
                                );
                                await logger.info({
                                    Route: "/login",
                                    Method: "POST",
                                    IPAddress: req.ip,
                                    Info : "Tokens Created",
                                    Description: "AccessToken and RefreshToken Created",
                                    Response: {
                                        error: false,
                                        message: "Login Successfully",
                                        StatusCode: 200
                                    },
                                    id: result[0].id
                                });
                                res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
                                res.cookie("token", accessToken, { httpOnly: true, secure: true });
                                return res.status(200).send({
                                    error: false,
                                    message: "Login Successfully",
                                });
                            } else {
                                await logger.error({
                                    Route: "/login",
                                    Method: "POST",
                                    IPAddress: req.ip,
                                    Info: "Invalid Credentials",
                                    Description: "Server Rejected the user due to Invalid Credentials",
                                    Response: {
                                        error: true,
                                        message: "Incorrect Password or Username",
                                        StatusCode: 404
                                    },
                                    id: result[0].id
                                });
                                return res.status(404).send({
                                    error: true,
                                    message: "Incorrect Password or Username",
                                });
                            }
                        } else {
                            console.log("User not found");
                            return res.status(404).send({
                                error: true,
                                message: "No User Found",
                            });
                        }
                    }
                );
            } else {
                jwt.verify(refreshToken, "my-secret", (err, user) => {
                    if (err) {
                        console.error("Error verifying refresh token:", err);
                        return res.status(403).send("Forbidden");
                    }
                    const accessToken = jwt.sign(
                        { id: user.id, username: user.username },
                        "my-secret",
                        { expiresIn: "1h" }
                    );
                    res.cookie("token", accessToken, { httpOnly: true, secure: true });
                    res.status(200).send({
                        error: false,
                        message: "Login Successful",
                    });
                });
            }
        } else {
            jwt.verify(token, "my-secret", (err, user) => {
                if (err) {
                    console.error("Error verifying access token:", err);
                    return res.status(403).send("Forbidden");
                }
                res.status(200).send({
                    error: false,
                    message: "Login Successful",
                });
            });
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).send({
            error: true,
            message: "Internal Server Error",
        });
    }
});


module.exports = login;