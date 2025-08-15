const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.send("Hello From Home Page");
});
app.get("/about", (req, res) => {
  return res.send("hello from about " + "hey " + req.query.name);
});
app.get("/profile", (req, res) => {
  return res.send("hello from profile");
});

app.listen(8000, () => console.log('Server started!'))