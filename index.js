const express = require("express");
const cors = require("cors");
const app = express();
const cookieparser = require("cookie-parser");
const todo = require("./routes/Todo");
const section = require("./routes/Section");
const login = require("./routes/Login");
const signup = require("./routes/Signup");
const logout = require("./routes/Logout");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(cookieparser());

app.use("/todo", todo);
app.use("/section", section);
app.use("/login", login);  
app.use("/signup", signup);
app.use("/logout", logout);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
