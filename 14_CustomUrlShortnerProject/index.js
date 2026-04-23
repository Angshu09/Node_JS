const express = require("express");
const { connectDb } = require("./connection");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRoute")
const URL = require("./models/url");
const path = require('path');

const app = express();
const PORT = 8002;

connectDb("mongodb://localhost:27017/url-shortener").then(() =>
  console.log("MongoDb connected"),
);

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use("/url", urlRoute);
app.use("/", staticRoute)

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

  return res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server started at PORT- ${PORT}`));
