const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const BLOG = require('./models/blog')

mongoose
  .connect("mongodb://127.0.0.1:27017/blogmania")
  .then((e) => console.log("mongoDb connected"));

const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.use(express.static(path.resolve("./public")))

app.get("/", async (req, res) => {
  // console.log(req.cookies)
  const allBlogs = await BLOG.find({})
  return res.render("home", { user: req.user, allBlogs: allBlogs });
});

app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));



mongodb+srv://angshu:<db_password>@cluster0.jnecgun.mongodb.net/?appName=Cluster0
