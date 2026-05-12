const express = require("express");
const { connectDb } = require("./connection");
const URL = require("./models/url");
const path = require("path");
const cookieParser = require('cookie-parser')
// const {restrictToLoggedInUserOnly, checkAuth} = require('./middlewares/auth')
const {restrictTo, checkForAuthentication} = require('./middlewares/auth')
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRoute");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8002;

connectDb("mongodb://localhost:27017/url-shortener").then(() =>
  console.log("MongoDb connected"),
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(checkForAuthentication)

app.use("/url", restrictTo(['NORMAL', 'ADMIN']), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);


//This is for getting the main website using the short ID
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
  );

  if(entry === null) return

  return res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server started at PORT- ${PORT}`));
