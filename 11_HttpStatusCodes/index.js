const express = require("express");
let users = require("./mockData.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

//Middleware - plugin ---> 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log('hello middleware 1')
  // req.myUserName = "Angshu Das"
  fs.appendFile('./log.txt', `\n${Date.now()}, ${req.method}, ${req.path}`, (err, data) => {
    next()
  })
})


app.use((req, res, next) => {
  // console.log('hello from middleware 2', req.myUserName)
  console.log('hello from middleware 2')
  next()
})

//Routes --->

//android and web dynamic
app.get("/api/users", (req, res) => {
  console.log(req.headers)
  res.setHeader('X-myName', "Angshu Das") //Custom Header
  //Always add X to  custom headers, it is a good practice
  return res.json(users);
});

//it will return a html page
app.get("/users", (req, res) => {
  const html = `<ul>
    ${users
      .map(
        (user) =>
          `<li>${user.first_name} ${user.last_name}, ${user.email}, ${user.gender}</li>`,
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
  .get((req, res) => {
    //getting user with id
    const user = users.find((user) => user.id === Number(req.params.id));
    if(!user) return res.status(404).json({message: 'User not found'})  
    return res.json(user);
  })
  .patch((req, res) => {
    //edit user with id
    const id = Number(req.params.id);

    let user = users.find((user) => user.id === id);

    if (user) {
      const index = users.indexOf(user);
      user = { ...user, ...req.body };
      users[index] = user;

      fs.writeFile("./mockData.json", JSON.stringify(users), (err) => {
        if (err)
          return res.status(500).json({ success: "There is some issue " });

        return res.json({
          user: user,
          status: "success",
        });
      });
    } else {
      return res.json({ status: "user not found" });
    }
  })
  .delete((req, res) => {
  const id = Number(req.params.id);

  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ status: "user not found" });
  }

  //this means it will only going to remove 1 element because the syntax of splice is - array.splice(start, deleteCount, item1, item2, ...)
  users.splice(index, 1);

  fs.writeFile("./mockData.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({
        status: "server error",
      });
    }

    return res.json({
      status: "success",
    });
  });
});

//creating new user
app.post("/api/users", (req, res) => {
  const body = req.body
  if(!body || !body.first_name || !body.last_name || !body.email || !body.gender){
    return res.status(400).json({message: 'All fields are required'})
  }
  const newUser = { ...body, id: users[users.length - 1].id + 1 };

  users.push(newUser);

  fs.writeFile("./mockData.json", JSON.stringify(users), (err) => {
    if (err) return res.status(500).json({ success: false });

    return res.status(201).json({
      success: true,
      id: newUser.id,
    });
  });
});

app.listen(PORT, () => console.log(`Server started on PORT- ${PORT}`));
