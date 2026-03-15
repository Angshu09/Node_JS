# Middleware in Node.js and Express.js

## Definition

**Middleware** is a function that executes **between receiving a request and sending a response** in an Express application.

It has access to:

* `req` (request object)
* `res` (response object)
* `next()` function

Middleware can:

* Execute code
* Modify request or response objects
* End the request-response cycle
* Call the next middleware using `next()`

---

## Basic Syntax

```javascript
app.use((req, res, next) => {
  console.log("Middleware executed");
  next();
});
```

### Explanation

* `req` → request data
* `res` → response object
* `next()` → passes control to the next middleware or route handler

If `next()` is not called, the request **will stop at that middleware**.

---

## Example

```javascript
const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("Request received");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
```

### Request Flow

```
Client Request
      ↓
Middleware
      ↓
Route Handler
      ↓
Response Sent
```

---

## Types of Middleware in Express

### 1. Application Level Middleware

Applied to the **entire application**.

```javascript
app.use((req, res, next) => {
  console.log("Application middleware");
  next();
});
```

---

### 2. Route Level Middleware

Applied to **specific routes only**.

```javascript
function middlewareFunction(req, res, next) {
  console.log("Route middleware");
  next();
}

app.get("/users", middlewareFunction, (req, res) => {
  res.send("Users list");
});
```

---

### 3. Built-in Middleware

Middleware functions **provided by Express**.

Examples:

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
```

Purpose:

* Parse JSON data
* Parse form data
* Serve static files

---

### 4. Third-Party Middleware

External packages that extend Express functionality.

Common examples:

* `cors`
* `morgan`
* `body-parser`

Example:

```javascript
const cors = require("cors");
app.use(cors());
```

---

### 5. Error Handling Middleware

Used to handle application errors.

```javascript
app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong");
});
```

Note: Error middleware contains **four parameters**.

---

## Example: Authentication Middleware

```javascript
function authMiddleware(req, res, next) {
  if (req.headers.token === "12345") {
    next();
  } else {
    res.send("Unauthorized");
  }
}

app.get("/dashboard", authMiddleware, (req, res) => {
  res.send("Welcome to Dashboard");
});
```

---

## Advantages of Middleware

* Improves code reusability
* Helps process requests before response
* Provides security (authentication, authorization)
* Enables logging and monitoring
* Centralized error handling

---

## Real World Uses

Middleware is commonly used for:

* Authentication
* Logging requests
* Data validation
* Parsing request body
* Error handling

---

## Short Interview Definition

> Middleware in Express.js is a function that has access to the request object, response object, and the `next()` function, and it is used to process requests before sending the response.
