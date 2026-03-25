# Model View Controller (MVC) – Complete Guide

MVC (Model View Controller) is a **design pattern** used to organize code in a structured way, especially in **backend development and web applications**.

It helps in **separating concerns**, making the code more **scalable, maintainable, and clean**.

---

# 1. What is MVC?

MVC divides an application into **three main components**:

* Model
* View
* Controller

Each part has a **specific responsibility**.

---

# 2. MVC Architecture Diagram (Concept)

```id="1f0h5v"
User Request → Controller → Model → Database
                         ↓
                     View (Response)
                         ↓
                     User
```

---

# 3. Components of MVC

---

## 1. Model

### Definition

The **Model** represents the **data layer** of the application.

It handles:

* Database interaction
* Data structure
* Business logic

### Example (Mongoose Model)

```javascript id="h7dpfa"
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

### Responsibilities

* Fetch data from DB
* Insert/update/delete data
* Apply validation rules

---

## 2. View

### Definition

The **View** is the **presentation layer**.

It is responsible for:

* Displaying data to the user
* UI / frontend part

### Examples

* HTML pages
* React components
* JSON responses (in APIs)

### Example (Simple HTML Response)

```javascript id="1dtc8n"
res.send("<h1>Hello User</h1>");
```

### Example (API Response)

```javascript id="kfrc5t"
res.json({
  name: "Angshu",
  email: "angshu@gmail.com"
});
```

---

## 3. Controller

### Definition

The **Controller** acts as a **bridge between Model and View**.

It handles:

* Incoming requests
* Business logic
* Calling Model functions
* Sending responses

### Example

```javascript id="q2r2tb"
const User = require("../models/user");

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

module.exports = { getUsers };
```

### Responsibilities

* Handle routes
* Process request data
* Call model methods
* Return response

---

# 4. MVC Flow (Step-by-Step)

1. User sends request (browser/API)
2. Route sends request to Controller
3. Controller processes request
4. Controller interacts with Model
5. Model communicates with Database
6. Data returns to Controller
7. Controller sends response via View

---

# 5. MVC Folder Structure (Node.js)

```id="7dxk7o"
project/
│
├── models/
│   └── user.js
│
├── controllers/
│   └── userController.js
│
├── routes/
│   └── userRoutes.js
│
├── views/ (optional)
│
├── app.js
└── package.json
```

---

# 6. Example Implementation (Express + MVC)

---

## Model (models/user.js)

```javascript id="g1g6w5"
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model("User", userSchema);
```

---

## Controller (controllers/userController.js)

```javascript id="xx2ac0"
const User = require("../models/user");

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};
```

---

## Routes (routes/userRoutes.js)

```javascript id="jo3k9e"
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getUsers);
router.post("/", userController.createUser);

module.exports = router;
```

---

## App Entry (app.js)

```javascript id="ui3pq3"
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

app.listen(3000, () => console.log("Server running"));
```

---

# 7. Advantages of MVC

* Separation of concerns
* Easy to maintain
* Scalable architecture
* Code reusability
* Better team collaboration

---

# 8. Disadvantages of MVC

* Slightly complex for beginners
* More files and structure
* Initial setup takes time

---

# 9. When to Use MVC

Use MVC when:

* Building **large applications**
* Working in **teams**
* Need **clean architecture**
* Creating **APIs or full-stack apps**

---

# 10. Real-Life Analogy

Think of a **restaurant** 🍽️:

| Component  | Role                                |
| ---------- | ----------------------------------- |
| Model      | Kitchen (prepares food/data)        |
| View       | Plate/Presentation (UI)             |
| Controller | Waiter (handles request & response) |

---

# 11. Summary

* MVC separates application into **Model, View, Controller**
* Model → handles data
* View → handles UI/response
* Controller → handles logic
* Improves **code structure and maintainability**

---

MVC is widely used in **Node.js, Django, Laravel, Spring Boot**, and many other frameworks.

---
