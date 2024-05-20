const express = require("express")
const todo = express.Router()
const authenticateToken = require("../controller/Authentication")
const conn = require("../config/dbconfig")


todo.get("/:sec_id/:id",authenticateToken ,(req, res) => {
    const task = req.params.id;
    const sec_id = req.params.sec_id;
    conn.query(
        "SELECT * FROM todo WHERE user_id = ? and id = ? and section_id = ?",
        [req.user.id, task,sec_id],
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

todo.post("/createtodo", authenticateToken, (req, res) => {
    const { todo, endeddate, completed, section_id } = req.body
    const date = new Date()
    console.log("check 1")
    conn.query("INSERT INTO todo (todo, created_date, end_date, completed, user_id, section_id) VALUES (?, ?, ?, ?, ?, ?)", [todo, date, endeddate, completed, req.user.id, section_id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(301).send({
                Error: true,
                Message: "Todo creation unsuccessful",
            });
        } else {
            console.log("check 3");
            console.log(result);
            res.status(201).send({
                data: result,
            });
        }
    });

});

todo.put("/updatetodo", authenticateToken, (req, res) => {
    const { todo, end_date, completed, task_id } = req.body;
    const date = new Date()
    conn.query("UPDATE todo SET todo= ? , end_date = ?,  last_updated = ?, completed = ? WHERE id = ? AND user_id = ?", [todo, end_date, date, completed, task_id, req.user.id], (err, result) => {
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

todo.delete("/deletetodo", authenticateToken, (req, res) => {
    const { section_id, task_id } = req.body;
    conn.query("DELETE FROM TODO WHERE section_id = ? AND user_id = ? AND id = ?", [section_id, req.user.id, task_id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(301).send({
                Error: true,
                Message: "Todo Deletion unsuccessful",
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

module.exports = todo;