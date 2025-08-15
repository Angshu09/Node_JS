// const http = require("http");
// const fs = require("fs");
// const url = require("url");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.send("Hello From Home Page");
});
app.get("/about", (req, res) => {
  return res.send("hello from about " + "hey " + req.query.name);
});

app.listen(8000, () => console.log('Server started!'))

// const myServer = http.createServer(app)
// const handlerFunction = (req, res) => {
//   if (req.url == "/favicon.ico") {
//     return res.end();
//   }
//   const log = `${Date.now()} ${req.url} req rec...\n`;
//   const myUrl = url.parse(req.url, true);
//   console.log(myUrl);
//   fs.appendFile("./log.txt", log, (err, data) => {
//     switch (myUrl.pathname) {
//       case "/":
//         res.end("Home page");
//         break;
//       case "/about":
//         const name = myUrl.query.name;
//         res.end(`Hi! ${name}`);
//         break;
//       case "/search":
//         const search = myUrl.query.search_query;
//         res.end(`Here are the results for ${search}`);
//         break;
//       default:
//         res.end("404 Not Found");
//     }
//   });
// };
// const myServer = http.createServer(handlerFunction);
// myServer.listen(8000, () => {
//   console.log("server start");
// });
