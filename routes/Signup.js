const express = require("express")
const signup = express.Router()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conn = require("../config/dbconfig")

signup.post("/", async (req, res) => {
    const { name, email, username, password } = req.body;
    conn.query(
        "SELECT id FROM login WHERE email = ? OR username = ?",
        [email, username],
        async (err, result) => {
            if (err) {
                console.log("Error Inside signup at database query getting data:", err);
                res.status(500).send({
                    Error: true,
                    Message: "Internal Server Error",
                });
            } else {
                if (result.length > 0) {
                    res.status(409).send({
                        Error: true,
                        Message: "User Exists With above email or username",
                    });
                } else {
                    try {
                        const hashedpassword = await bcrypt.hash(password, 10);
                        console.log(hashedpassword);
                        conn.query(
                            "INSERT INTO login(name,email,username,password) VALUES(?,?,?,?)",
                            [name, email, username, hashedpassword],
                            (err, result) => {
                                if (err) {
                                    console.log(
                                        "Error Inside login at database query inserting data"
                                    );
                                    res.status(404).send({
                                        Error: true,
                                        Message: "Internal Server Error",
                                    });
                                } else {
                                    res.status(201).send({
                                        Error: false,
                                        Message: "User Created",
                                    });
                                }
                            }
                        );
                    } catch (error) {
                        console.log("Error while hashing password:", error);
                        res.status(500).send({
                            Error: true,
                            Message: "Error while hashing password",
                        });
                    }
                }
            }
        }
    );
});

module.exports = signup;