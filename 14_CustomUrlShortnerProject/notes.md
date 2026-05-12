# 📘 MERN Revision Notes - Node.js, SSR, Authentication & MongoDB

---

# 🔹 1. Path in Node.js

## 📌 Definition

`path` is a core Node.js module used to work with file and directory paths.

---

## ✅ Common Uses

* Joining paths
* Resolving absolute paths
* Getting file extensions

---

## 🧾 Syntax

```js
const path = require("path");

const filePath = path.join(__dirname, "views", "index.ejs");

console.log(path.extname(filePath));

console.log(path.resolve("views", "index.ejs"));
```

---

# 🔹 2. Server Side Rendering (SSR)

## 📌 Definition

SSR means rendering HTML on the server and sending fully generated HTML to the browser.

---

## ⚙️ Flow

Client → Server → HTML Generated → Browser

---

## ✅ Advantages

* Better SEO
* Faster initial page load
* Better performance on slow devices

---

# 🔹 3. EJS (Embedded JavaScript)

## 📌 Definition

EJS is a templating engine used in Node.js to create dynamic HTML pages.

---

## 🧾 Syntax

```ejs
<h1><%= title %></h1>

<% if(user) { %>
  <p>Welcome <%= user %></p>
<% } %>
```

---

## 🔑 EJS Tags

| Tag      | Purpose      |
| -------- | ------------ |
| `<% %>`  | Logic        |
| `<%= %>` | Output value |
| `<%- %>` | Raw HTML     |

---

# 🔹 4. Different Types of View Engines

| Engine     | Description             |
| ---------- | ----------------------- |
| EJS        | JavaScript-based        |
| Pug        | Indentation-based       |
| Handlebars | Logic-less templates    |
| Mustache   | Minimal template engine |
| Nunjucks   | Advanced templating     |

---

# 🔹 5. Perks of View Engines

* Dynamic HTML generation
* Reusable templates
* Clean UI structure
* Easy SSR implementation

---

# 🔹 6. Views in Express

## 📌 Definition

Views are template files used to render UI.

---

## 📁 Folder Structure

```txt
project/
│
├── views/
│   ├── index.ejs
│   └── about.ejs
│
├── app.js
```

---

# 🔹 7. Setting up EJS in Express

```js
const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    user: "Angshu"
  });
});

app.listen(3000);
```

---

# 🔹 8. Example EJS File

```ejs
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1>Welcome <%= user %></h1>
</body>
</html>
```

---

# 🔹 9. Modern SSR Approach

## 🚀 Best Modern SSR Framework

Use **Next.js**

---

## ✅ Why Next.js?

* Built-in SSR
* React Server Components
* Better performance
* Full-stack support

---

## ⚡ Comparison

| Approach | Usage       |
| -------- | ----------- |
| EJS SSR  | Small apps  |
| Next.js  | Modern apps |

---

# 🔹 10. Cookies in Node.js

## 📌 Definition

Cookies are small pieces of data stored in the browser by the server.

---

## ✅ Uses

* Authentication
* Session management
* User preferences

---

## 🧾 Setting Cookies

```js
res.cookie("token", "abc123");
```

---

# 🔹 11. Cookie Parser

## 📌 Definition

`cookie-parser` is a middleware used to read cookies from requests.

---

## 📦 Install

```bash
npm install cookie-parser
```

---

## 🧾 Usage

```js
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/", (req, res) => {
  console.log(req.cookies);
});
```

---

# 🔹 12. UUID Package

## 📌 Definition

UUID generates unique IDs.

---

## 📦 Install

```bash
npm install uuid
```

---

## 🧾 Usage

```js
const { v4: uuidv4 } = require("uuid");

console.log(uuidv4());
```

---

## ✅ Uses

* Unique IDs
* Tokens
* File names

---

# 🔹 13. deleteMany({})

## 📌 Definition

Deletes multiple documents from MongoDB.

---

## 🧾 Syntax

```js
await User.deleteMany({});
```

---

## ⚠️ Meaning

`{}` means delete all documents.

---

# 🔹 14. One-Line Middleware

## 📌 Example

```js
app.use(express.json());
```

---

# 🔹 15. How to Properly Use Middleware

## 📌 Definition

Middleware runs between request and response.

---

## 🧾 Example

```js
const logger = (req, res, next) => {
  console.log("Middleware executed");
  next();
};

app.use(logger);
```

---

## ⚠️ Important

Always call:

```js
next();
```

otherwise request will hang.

---

# 🔹 16. mongoose.Schema.Types.ObjectId

## 📌 Definition

`ObjectId` is used to create relationships between collections.

---

## 🧾 Example

```js
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
```

---

## ✅ Purpose

* Referencing another collection
* Creating relationships

---

## ✅ Common Use Cases

* User posts
* Comments
* Orders

---

# 🔹 17. Stateless Authentication

## 📌 Definition

Server does not store user session data.

Authentication is done using tokens.

---

## ✅ Example

JWT Authentication

---

# 🔹 18. Stateful vs Stateless Authentication

| Feature        | Stateful | Stateless |
| -------------- | -------- | --------- |
| Session Stored | Server   | Client    |
| Example        | Sessions | JWT       |
| Scalability    | Less     | More      |

---

# 🔹 19. JWT (JSON Web Token)

## 📌 Definition

JWT is a token used for authentication.

---

## 🧾 Structure

```txt
Header.Payload.Signature
```

---

## 🧾 Generate Token

```js
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { id: user._id },
  "secretkey"
);
```

---

# 🔹 20. Payload in JWT

## 📌 Definition

Payload contains user data inside the token.

---

## 🧾 Example

```js
{
  id: "123",
  email: "test@gmail.com"
}
```

---

# 🔹 21. Cookie Editor

## 📌 Best Extension

Install:

* Cookie Editor (Chrome Extension)

---

## ✅ Uses

* View cookies
* Edit cookies
* Delete cookies

---

# 🔹 22. Cookie Properties

| Property | Purpose           |
| -------- | ----------------- |
| httpOnly | Prevent JS access |
| secure   | HTTPS only        |
| maxAge   | Expiry time       |
| sameSite | CSRF protection   |

---

## 🧾 Example

```js
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  maxAge: 60000
});
```

---

# 🔹 23. Domain Name vs .domain

## 📌 Domain Name

Example:

```txt
google.com
```

---

## 📌 .domain in Cookies

Used to define where cookie is accessible.

---

## 🧾 Example

```js
res.cookie("token", token, {
  domain: ".google.com"
});
```

---

# 🔹 24. Authorization vs Authentication

| Authentication | Authorization        |
| -------------- | -------------------- |
| Who are you?   | What can you access? |
| Login          | Permissions          |

---

# 🔹 25. Bearer Token Authentication

## 📌 Definition

Token is sent in headers.

---

## 🧾 Example

```txt
Authorization: Bearer token_here
```

---

## ⚙️ Validation Flow

1. User logs in
2. Server generates JWT
3. Client stores token
4. Client sends token
5. Server verifies token

---

# 🔹 26. Response-Based Authorization

Server checks:

* Token validity
* User role
* Permissions

Then sends response accordingly.

---

# 🔹 27. Closures in JavaScript

## 📌 Definition

A closure is when an inner function remembers variables from its outer function even after the outer function has finished execution.

---

## 🧾 Example

```js
function outer() {
  let count = 0;

  function inner() {
    count++;
    console.log(count);
  }

  return inner;
}

const counter = outer();

counter();
counter();
counter();
```

---

## ✅ Output

```txt
1
2
3
```

---

## ✅ Uses of Closures

* Data hiding
* Counters
* Callbacks
* Timers

---

# ✅ Final Summary

* `path` → handle paths
* `EJS` → templating engine
* `SSR` → server-side rendering
* `cookie-parser` → read cookies
* `UUID` → unique IDs
* `JWT` → token authentication
* `ObjectId` → collection relationships
* `Closures` → function memory behavior
* Modern SSR → Next.js

---
