const express = require("express");
let users = require("./mockData.json");
const fs = require("fs");
const app = express();

const port = 8000;

//Middleware - plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "./log.txt",
    `\n${Date.now()}: ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

app.use((req, res, next) => {
  console.log("hello from middleware 1");
  // return res.json({msg: "hello from middleware 1"})
  req.myUserName = "Angshu.dev"; //Here we are add an extra property on the req object
  next();
});

app.use((req, res, next) => {
  console.log("Hello from middleware 2" + req.myUserName);
  next();
});

app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `;
  res.send(html);
});

//Routes
//Rest API
app.get("/api/users", (req, res) => {
  console.log(res.myUserName);
  res.setHeader("X-myName", "Angshu Das");
  return res.json(users);
});

//:id this colon is a dynamic value
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.json(user);
  })
  .patch((req, res) => {
    //Edit user with id
    const id = Number(req.params.id);
    const body = req.body;
    users = users.map((user) => {
      if (user.id === id) {
        return { ...user, ...body };
      }
      return user;
    });
    fs.writeFile("./mockData.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Edited", id: id });
    });
  })
  .delete((req, res) => {
    //Delete user with id
    const id = Number(req.params.id);
    const body = req.body;
    users = users.filter((user) => user.id != id);
    fs.writeFile("./mockData.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Deleted", id: id });
    });
  });

app.post("/api/users", (req, res) => {
  //Create a new user
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender
  ) {
    return res.status(400).json({ msg: "All fields required" });
  }
  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./mockData.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "Success", id: users.length });
  });
});

app.listen(port, () => console.log(`Server started at PORT:${port}`));
