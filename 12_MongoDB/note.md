# MongoDB + Node.js (Mongoose) – Complete Guide

This README covers:

* Connecting MongoDB with Node.js
* Creating Schema & Model
* Core MongoDB concepts (Document, Collection, Schema, Model)
* Common Database Operations (CRUD)

---

# 1. What is MongoDB?

MongoDB is a **NoSQL database** that stores data in **JSON-like format (BSON)**.

Instead of tables (like SQL), MongoDB uses:

* Collections
* Documents

---

# 2. Core Concepts

## 1. Document

A **document** is a single record in MongoDB.

Example:

```json
{
  "firstName": "Angshu",
  "email": "angshu@gmail.com",
  "age": 22
}
```

👉 Similar to a **row in SQL**

---

## 2. Collection

A **collection** is a group of documents.

Example:

```
users → [ {user1}, {user2}, {user3} ]
```

👉 Similar to a **table in SQL**

---

## 3. Schema

A **schema** defines the **structure of a document**.

It tells:

* What fields exist
* Data types
* Validation rules

Example:

```javascript
const userSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  age: Number
});
```

---

## 4. Model

A **model** is a wrapper around the schema used to interact with the database.

```javascript
const User = mongoose.model("User", userSchema);
```

👉 Model is used to perform **CRUD operations**

---

# 3. Connecting MongoDB with Node.js

## Step 1 – Install Dependencies

```bash
npm install mongoose
```

---

## Step 2 – Connect to Database

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/my-app")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error:", err));
```

Explanation:

* `mongodb://127.0.0.1:27017` → local MongoDB server
* `my-app` → database name

👉 If DB does not exist, MongoDB **creates it automatically**

---

# 4. Creating Schema and Model

## Schema

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true, unique: true },
  age: Number
});
```

---

## Model

```javascript
const User = mongoose.model("User", userSchema);
```

👉 This creates:

* Collection name → **users** (plural + lowercase automatically)

---

# 5. Why Collection Gets Created Automatically

MongoDB creates a collection **only when data is inserted**.

Example:

```javascript
await User.create({
  firstName: "John",
  email: "john@gmail.com"
});
```

👉 This will create:

* Database → if not exists
* Collection → `users`

---

# 6. Common Database Operations (CRUD)

---

## 1. CREATE (Insert Data)

### Method 1 – create()

```javascript
await User.create({
  firstName: "John",
  email: "john@gmail.com",
  age: 25
});
```

---

### Method 2 – new + save()

```javascript
const user = new User({
  firstName: "Alice",
  email: "alice@gmail.com"
});

await user.save();
```

---

## 2. READ (Fetch Data)

### Get all users

```javascript
const users = await User.find();
```

---

### Get one user

```javascript
const user = await User.findOne({ email: "john@gmail.com" });
```

---

### Get by ID

```javascript
const user = await User.findById("id_here");
```

---

## 3. UPDATE

### Update one document

```javascript
await User.updateOne(
  { email: "john@gmail.com" },
  { age: 30 }
);
```

---

### Find and update

```javascript
const updatedUser = await User.findByIdAndUpdate(
  "id_here",
  { age: 28 },
  { new: true }
);
```

---

## 4. DELETE

### Delete one

```javascript
await User.deleteOne({ email: "john@gmail.com" });
```

---

### Delete by ID

```javascript
await User.findByIdAndDelete("id_here");
```

---

### Delete all

```javascript
await User.deleteMany({});
```

---

# 7. Important Query Methods

| Method              | Purpose                |
| ------------------- | ---------------------- |
| find()              | Get multiple documents |
| findOne()           | Get single document    |
| findById()          | Find by ID             |
| create()            | Insert data            |
| save()              | Save document          |
| updateOne()         | Update single          |
| findByIdAndUpdate() | Update + return        |
| deleteOne()         | Delete one             |
| deleteMany()        | Delete multiple        |

---

# 8. Example API (Express + MongoDB)

```javascript
app.post("/users", async (req, res) => {

  const user = await User.create(req.body);

  res.status(201).json({
    message: "User created",
    user
  });

});
```

---

```javascript
app.get("/users", async (req, res) => {

  const users = await User.find();

  res.json(users);

});
```

---

# 9. Best Practices

* Always use **async/await**
* Add **validation in schema**
* Use **try-catch for error handling**
* Use **indexes (unique fields)** for performance
* Keep schema clean and structured

---

# 10. Summary

* MongoDB stores data in **documents (JSON-like format)**
* **Collection = group of documents**
* **Schema = structure definition**
* **Model = interface to database**
* CRUD operations are done using **Mongoose methods**
* Collections are created **automatically when inserting data**

---


