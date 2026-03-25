const express = require("express");
let users = require("./mockData.json");
const fs = require("fs");
const mongoose = require("mongoose");
const { type } = require("os");

const app = express();
const PORT = 8000;

//db connection
mongoose
  .connect("mongodb://127.0.0.1:27017/learning-app-1")
  .then(() => console.log("Mongo DB Connected"))
  .catch((err) => console.log("Mongo Error - ", err));

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    jobTitle: { type: String, required: true },
    gender: { type: String },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", userSchema);

//Middleware - plugin --->
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("hello middleware 1");
  // req.myUserName = "Angshu Das"
  fs.appendFile(
    "./log.txt",
    `\n${Date.now()}, ${req.method}, ${req.path}`,
    (err, data) => {
      next();
    },
  );
});

app.use((req, res, next) => {
  // console.log('hello from middleware 2', req.myUserName)
  console.log("hello from middleware 2");
  next();
});

//Routes --->

//android and web dynamic
app.get("/api/users", async (req, res) => {
  const allUsers = await User.find({});
  res.setHeader("X-myName", "Angshu Das"); //Custom Header
  //Always add X to  custom headers, it is a good practice
  return res.json(allUsers);
});

//it will return a html page
app.get("/users", async (req, res) => {
  const allUsers = await User.find({});
  const html = `<ul>
    ${allUsers
      .map(
        (user) =>
          `<li>${user.firstName} ${user.lastName}, ${user.email}, ${user.jobTitle}, ${user.gender}</li>`,
      )
      .join("")}
  </ul>`;

  res.send(html);
});

//android and web dynamic
// app.get("/api/users/:id", (req, res) => {
//   const user = users.find((user) => user.id === Number(req.params.id))
//   return res.json(user)
// })

//a merged way to do the requests for a same route get, edit, delete users
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    //getting user with id
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  })
  .patch(async (req, res) => {
    //edit user with id
    try {
      
      await User.findByIdAndUpdate(req.params.id, req.body);
      return res.status(200).json({ msg: "Success" });
    } catch (err) {
      return res.status(400).json({
        msg: "Unsuccessful",
      });
    }
  })
  .delete( async (req, res) => {
    try{await User.findByIdAndDelete(req.params.id)
    return res.json({msg: "success"})}
    catch(err){
      return res.json({
        msg: 'unsuccess',
        error: err.message
      })
    }
  });

//creating new user
app.post("/api/users", async (req, res) => {
  const { firstName, lastName, email, gender, jobTitle } = req.body;
  if (!req.body || !firstName || !jobTitle || !email) {
    return res.status(400).json({
      message:
        "firstName, email, jobTitle are required fields, may be you missed one of those",
    });
  }

  const result = await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    jobTitle: jobTitle,
    gender: gender,
  });

  return res.status(201).json({
    message: "Success",
    result: result,
  });
});

app.listen(PORT, () => console.log(`Server started on PORT- ${PORT}`));
