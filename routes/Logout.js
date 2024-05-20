const express = require("express");
const logout = express.Router();

logout.post("/", (req, res) => {
    res.clearCookie("token"); 
    res.status(200).send({
        "Error": false,
        "Message": "Logout Successful"
    });
});

module.exports = logout;
