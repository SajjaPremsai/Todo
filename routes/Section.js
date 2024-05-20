const express = require("express")
const section = express.Router()
const authenticateToken = require("../controller/Authentication")
const conn = require("../config/dbconfig")

section.get("/", authenticateToken, (req, res) => {
    conn.query(
        "SELECT id,name,Description,created_date FROM section WHERE user_id = ?",
        [req.user.id],
        (err, result) => {
            if (err) {
                res.status(500).send({
                    Error: true,
                    Message: "Internal Server Error",
                });
            } else {
                console.log(result);
                res.status(201).send({
                    data: result,
                });
            }
        }
    );
});

section.get("/:sectionid", authenticateToken, (req, res) => {
    console.log(req.params.sectionid, req.user);
    const sectionid = req.params.sectionid;
    conn.query(
        "SELECT * FROM todo WHERE user_id = ? AND section_id = ?",
        [req.user.id, sectionid],
        (err, result) => {
            if (err) {
                res.status(500).send({
                    Error: true,
                    Message: "Internal Server Error",
                });
            } else {
                console.log(result);
                res.status(201).send({
                    data: result,
                });
            }
        }
    );
});

section.post("/createsection", authenticateToken, (req, res) => {
    const { name, description } = req.body;
    const date = new Date();
    console.log("check 1");
    conn.query("INSERT INTO SECTION (name,description,created_date,user_id) VALUES (?,?,?,?)", [name, description, date, req.user.id], (err, result) => {
        if (err) {
            res.status(500).send({
                Error: true,
                Message: "Internal Server Error",
                error_msg: err
            });
        } else {
            console.log("check 3")
            console.log(result);
            res.status(201).send({
                data: result,
            });
        }
    })
});

section.put("/updatesection", authenticateToken, (req, res) => {
    const { name, description, section_id } = req.body;
    const date = new Date()
    conn.query("UPDATE section SET name= ? , description = ? , last_updated = ? WHERE user_id = ? AND id = ? ", [name, description, date, req.user.id, section_id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(301).send({
                Error: true,
                Message: "Todo Updation unsuccessful",
            });
        } else {
            console.log("check 3");
            console.log(result);
            res.status(201).send({
                data: result,
            });
        }
    })
});

section.delete("/:id", authenticateToken, (req, res) => {
    const section_id = req.params.id;
    conn.query("DELETE FROM SECTION WHERE id = ? AND user_id = ?", [section_id, req.user.id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(301).send({
                Error: true,
                Message: "Todo Section Deletion unsuccessful",
            });
        } else {
            console.log("check 3");
            console.log(result);
            res.status(201).send({
                data: result,
            });
        }
    })
})

module.exports = section