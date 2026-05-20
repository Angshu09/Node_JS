# 📚 Node.js, Express, MongoDB & EJS — Developer Notes

A detailed reference guide covering backend concepts including EJS templating, password hashing with crypto, Mongoose advanced features, and Express middleware patterns.

---

## Table of Contents

- [EJS Partials](#-ejs-partials)
- [Dev Dependencies](#-devdependencies)
- [Salts for Password Hashing](#-salts-for-password-hashing)
- [What is a Cryptographic Hash?](#-what-is-a-cryptographic-hash)
- [createHmac](#-createhmac)
- [SHA-256](#-sha-256)
- [Digest Hex](#-digest-hex)
- [Hashing Passwords — Full Example](#-hashing-passwords--full-example)
- [Mongoose Virtual Functions](#-mongoose-virtual-functions)
- [Mongoose Static Methods](#-mongoose-static-methods)
- [Express Does NOT Serve Static Files by Default](#-express-does-not-serve-static-files-by-default)
- [express.static Middleware](#-expressstatic-middleware)
- [populate() in MongoDB / Mongoose](#-populate-in-mongodb--mongoose)
- [ObjectId in MongoDB](#-objectid-in-mongodb)
- [locals in EJS](#-locals-in-ejs)

---

## 🧩 EJS Partials

**EJS (Embedded JavaScript)** is a templating engine for Node.js. Partials allow you to break your views into reusable components — like a shared header, footer, or navbar — so you don't repeat HTML across every page.

### How Partials Work

A partial is just a regular `.ejs` file. You include it in another EJS file using:

```ejs
<%- include('path/to/partial') %>
```

> **Note:** Use `<%-` (not `<%=`) to render the included HTML without escaping it.

### Example Structure

```
views/
├── partials/
│   ├── header.ejs
│   ├── navbar.ejs
│   └── footer.ejs
├── index.ejs
└── about.ejs
```

**`views/partials/header.ejs`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><%= title %></title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
```

**`views/partials/footer.ejs`**
```html
  <footer>
    <p>&copy; 2024 My App</p>
  </footer>
</body>
</html>
```

**`views/index.ejs`**
```ejs
<%- include('partials/header') %>

<main>
  <h1>Welcome to <%= title %></h1>
  <p>This is the home page.</p>
</main>

<%- include('partials/footer') %>
```

**`app.js`**
```js
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});
```

### Why Use Partials?

- Avoid copy-pasting HTML across files
- One change in a partial updates every page
- Cleaner and more maintainable code

---

## 📦 devDependencies

In a `package.json`, dependencies are split into two categories:

| Section | Purpose |
|---|---|
| `dependencies` | Packages required to **run** the app in production |
| `devDependencies` | Packages only needed during **development/testing** |

### Installing as devDependency

```bash
npm install --save-dev <package>
# or shorthand:
npm install -D <package>
```

### Example `package.json`

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "ejs": "^3.1.9"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0",
    "eslint": "^8.45.0"
  }
}
```

### Common devDependencies

- **nodemon** — auto-restarts server on file changes
- **jest / mocha** — testing frameworks
- **eslint / prettier** — linting and formatting
- **dotenv** — loading `.env` variables locally

> When deploying to production, you can skip devDependencies with:
> ```bash
> npm install --production
> ```

---

## 🧂 Salts for Password Hashing

A **salt** is a random string of data that is added to a password **before** hashing it.

### Why Salts Are Necessary

Without a salt, if two users have the same password, their hashes will be identical. This makes it trivial for an attacker to use a **rainbow table** (a pre-computed list of hash values) to reverse-engineer passwords.

**Without salt:**
```
"password123" → abc123hash  ← same for every user!
```

**With salt:**
```
"password123" + "xK92#mPq" → f7e3a91bc...  ← unique per user
"password123" + "nQ05@zRw" → 3d8c7f2a1...  ← different hash, same password!
```

### Key Points

- The salt is **stored alongside the hash** in the database (it's not secret)
- It just ensures every hash is **unique**, even for identical passwords
- Salts prevent rainbow table attacks and bulk cracking

### Generating a Salt with Node's crypto module

```js
const crypto = require('crypto');

const salt = crypto.randomBytes(16).toString('hex');
console.log(salt);
// Example: "3f8a2c1b9e0d4f7a6b5c8d2e1f0a3b4c"
```

---

## 🔐 What is a Cryptographic Hash?

A **hash function** takes an input (any data) and produces a fixed-length string output called a **hash** or **digest**.

### Properties of a Good Hash Function

| Property | Description |
|---|---|
| **Deterministic** | Same input always gives the same output |
| **One-way** | Cannot reverse-engineer the original input from the hash |
| **Avalanche effect** | Tiny change in input → completely different hash |
| **Fixed length** | Output is always the same size regardless of input size |
| **Collision resistant** | Very hard to find two inputs with the same hash |

### Example

```
"hello"  → 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
"hellp"  → 06b9b5a5a2f9e3c26e1f6c8b4e9f10d3a7b2c1e5d8f9a0b3c6d7e8f9a0b1c2
```

> Even changing one character produces a totally different hash — this is the **avalanche effect**.

### Common Hash Algorithms

| Algorithm | Output Length | Use Case |
|---|---|---|
| MD5 | 128-bit (32 hex chars) | ⚠️ Broken — do not use for passwords |
| SHA-1 | 160-bit (40 hex chars) | ⚠️ Deprecated |
| **SHA-256** | 256-bit (64 hex chars) | ✅ Recommended |
| SHA-512 | 512-bit (128 hex chars) | ✅ Strong |
| bcrypt | Variable | ✅ Best for passwords (slow by design) |

---

## 🔑 createHmac

`crypto.createHmac()` creates an **HMAC (Hash-based Message Authentication Code)**.

HMAC combines a **secret key** with the hash function to produce a hash that can only be reproduced if you know the key. It's used to verify both the **integrity** and **authenticity** of data.

### Syntax

```js
crypto.createHmac(algorithm, secret_key)
```

### Parameters

| Parameter | Description |
|---|---|
| `algorithm` | Hash algorithm to use (e.g., `'sha256'`) |
| `secret_key` | A private key/secret only your app knows |

### Example

```js
const crypto = require('crypto');

const secretKey = 'mySecretKey';
const data = 'user-password-or-message';

const hmac = crypto.createHmac('sha256', secretKey)
                   .update(data)
                   .digest('hex');

console.log(hmac);
// Output: a unique hex string, reproducible only with the same key + data
```

### createHash vs createHmac

| | `createHash` | `createHmac` |
|---|---|---|
| Uses a secret key? | ❌ No | ✅ Yes |
| Can be verified? | Only by re-hashing | Yes, using the key |
| Use case | Checksums, general hashing | Authentication, signatures |

---

## 🔒 SHA-256

**SHA-256** (Secure Hash Algorithm 256-bit) is a member of the SHA-2 family developed by the NSA. It is one of the most widely used cryptographic hash algorithms.

### Properties

- Produces a **256-bit (32-byte)** output, displayed as 64 hexadecimal characters
- Used in TLS/SSL, Bitcoin, digital certificates, JWT signing, and more
- Considered **cryptographically secure** as of today

### Using SHA-256 in Node.js

```js
const crypto = require('crypto');

const hash = crypto.createHash('sha256')
                   .update('my secret password')
                   .digest('hex');

console.log(hash);
// e.g.: 89e01536ac207279409d4de1e5253e01ea85473d4a7ddc17b02b6c0b5e9e0b92
```

### Why SHA-256 Alone Is NOT Enough for Passwords

SHA-256 is **fast** — which is actually bad for passwords. Attackers can compute billions of SHA-256 hashes per second with modern hardware. For passwords, you should:

1. Always use a **salt** (as described above)
2. Use a deliberately **slow** algorithm like bcrypt, argon2, or scrypt in production

---

## 🧪 Digest Hex

After creating a hash, you call `.digest()` to get the final result. The `digest()` method accepts an encoding argument that controls the **output format**.

### Common Digest Encodings

| Encoding | Output | Example |
|---|---|---|
| `'hex'` | Hexadecimal string | `"a1b2c3d4..."` |
| `'base64'` | Base64 string | `"obLDaA=="` |
| `'binary'` | Raw binary string | Non-printable characters |

### What is Hex?

Hexadecimal uses 16 symbols: `0–9` and `a–f`. Each byte is represented as 2 hex characters.

SHA-256 produces 32 bytes → 64 hex characters.

```js
const crypto = require('crypto');

const hash = crypto.createHash('sha256')
                   .update('hello')
                   .digest('hex');      // ← "hex" format

console.log(hash.length); // 64 characters
```

### Why `'hex'`?

- Human-readable (printable ASCII)
- Easy to store in databases as a string
- Standard format for hashes in APIs, tokens, and logs

---

## 🔐 Hashing Passwords — Full Example

Here's a complete example combining **salt + createHmac + sha256 + digest hex** to securely hash a password:

### Setup

```js
const crypto = require('crypto');
```

### Hash Function

```js
function hashPassword(plainPassword) {
  // Step 1: Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');

  // Step 2: Hash the password with the salt using HMAC-SHA256
  const hash = crypto.createHmac('sha256', salt)
                     .update(plainPassword)
                     .digest('hex');

  // Step 3: Return both salt and hash (store both in DB)
  return { salt, hash };
}

function verifyPassword(plainPassword, storedSalt, storedHash) {
  // Re-hash the plain password with the stored salt
  const hash = crypto.createHmac('sha256', storedSalt)
                     .update(plainPassword)
                     .digest('hex');

  // Compare (use timingSafeEqual to prevent timing attacks)
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(storedHash)
  );
}
```

### Using It

```js
// Registration
const { salt, hash } = hashPassword('mySecurePassword123');
// Save `salt` and `hash` to the database (never save the plain password)

// Login verification
const isValid = verifyPassword('mySecurePassword123', salt, hash);
console.log(isValid); // true
```

### Mongoose Schema Integration

```js
const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  passwordSalt: String,
});

// Hash before saving
userSchema.pre('save', function (next) {
  if (!this.isModified('passwordHash')) return next();

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt)
                     .update(this.passwordHash) // treat as plain text here
                     .digest('hex');

  this.passwordSalt = salt;
  this.passwordHash = hash;
  next();
});

const User = mongoose.model('User', userSchema);
```

> ⚠️ **Production note:** For real applications, consider using `bcrypt` or `argon2` instead — they are designed specifically for password hashing and have built-in work factors to slow down brute-force attacks.

---

## 🧬 Mongoose Virtual Functions

A **virtual** is a property on a Mongoose schema that is **not stored in MongoDB**. It's computed dynamically from other fields when you access it.

### Why Use Virtuals?

- Combine first name + last name → `fullName`
- Format a date without storing a new field
- Create computed URLs or labels
- Keep the database lean (no redundant data)

### Defining a Virtual

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
});

// Define the virtual
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);
```

### Using the Virtual

```js
const user = new User({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' });
console.log(user.fullName); // "John Doe"
```

> `fullName` is **not saved** to the database — it's computed on the fly.

### Virtual Setter (optional)

```js
userSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (name) {
    const [first, ...rest] = name.split(' ');
    this.firstName = first;
    this.lastName = rest.join(' ');
  });

// Usage
user.fullName = 'Jane Smith';
console.log(user.firstName); // "Jane"
console.log(user.lastName);  // "Smith"
```

### Including Virtuals in JSON Output

By default, virtuals are excluded from `.toJSON()` and `.toObject()`. Enable them:

```js
const userSchema = new mongoose.Schema(
  { firstName: String, lastName: String },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
```

---

## 🏛️ Mongoose Static Methods

**Static methods** are functions defined on the **Model** itself (not on individual document instances). You call them on the model class, not on a document.

### Instance vs Static Method

| | Instance Method | Static Method |
|---|---|---|
| Called on | A document (`user.greet()`) | The Model (`User.findByEmail()`) |
| Access to `this` | The individual document | The Model class |
| Use case | Actions on one document | Queries, lookups, aggregations |

### Defining a Static Method

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

// Define a static method
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.statics.findAdmins = async function () {
  return this.find({ role: 'admin' });
};

const User = mongoose.model('User', userSchema);
```

### Using Static Methods

```js
// No need to create an instance — call on the model directly
const user = await User.findByEmail('john@example.com');
const admins = await User.findAdmins();
```

### When to Use Statics

- Custom query helpers (`findByUsername`, `findActive`, etc.)
- Business logic that queries multiple documents
- Authentication helpers like `User.authenticate(email, password)`

---

## 🚫 Express Does NOT Serve Static Files by Default

By default, Express **does not serve any files** from the filesystem. If a client requests `/styles.css`, Express won't magically find and send that file — it will just return a `404` error unless you explicitly configure it.

### Why?

Express is designed to be minimal. Serving files is opt-in behavior. Without middleware, Express only handles routes you define:

```js
app.get('/', (req, res) => {
  res.send('Hello World'); // ← Only this route works
});

// A request to /styles.css returns 404 — Express doesn't know where to look
```

This separation is intentional:
- Backend code (`app.js`, routes, models) → handled by Node/Express
- Static files (CSS, images, JS) → must be explicitly enabled

---

## 📁 express.static Middleware

`express.static` is a **built-in middleware** that tells Express to serve files from a specified folder automatically.

### Syntax

```js
app.use(express.static('folder_name'));
// or with path.join for safety:
app.use(express.static(path.join(__dirname, 'public')));
```

### Example

**Folder structure:**
```
project/
├── app.js
└── public/
    ├── styles.css
    ├── app.js
    └── images/
        └── logo.png
```

**`app.js`:**
```js
const express = require('express');
const path = require('path');
const app = express();

// Serve everything inside the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => console.log('Server running on port 3000'));
```

Now these URLs work automatically:
- `http://localhost:3000/styles.css`
- `http://localhost:3000/app.js`
- `http://localhost:3000/images/logo.png`

### Serving with a Virtual Prefix

You can mount static files under a URL prefix:

```js
app.use('/static', express.static(path.join(__dirname, 'public')));
```

Now files are accessible at:
- `http://localhost:3000/static/styles.css`

### Multiple Static Directories

```js
app.use(express.static('public'));
app.use(express.static('uploads'));
```

Express searches them in order and returns the first match.

---

## 🔗 populate() in MongoDB / Mongoose

`populate()` is a Mongoose feature that **replaces an ObjectId reference** in a document with the actual data from the referenced collection — like a SQL JOIN, but for MongoDB.

### The Problem Without populate()

```js
// Post document stored in DB:
{
  _id: ObjectId("abc123"),
  title: "My Post",
  author: ObjectId("user456")  // ← just an ID, not the actual user data
}
```

### The Solution: populate()

```js
const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ← 'ref' is key
});

const Post = mongoose.model('Post', postSchema);
```

```js
// Without populate — author is just an ObjectId
const post = await Post.findById('abc123');
console.log(post.author); // ObjectId("user456")

// With populate — author is the full user document
const post = await Post.findById('abc123').populate('author');
console.log(post.author.username); // "john_doe"
```

### Selecting Specific Fields

```js
// Only fetch username and email from the User document
const post = await Post.findById('abc123').populate('author', 'username email');
```

### Nested Population

```js
// Populate the author, and also populate the author's posts
const post = await Post.findById('abc123')
  .populate({
    path: 'author',
    populate: { path: 'posts' }
  });
```

### Populating Multiple Fields

```js
const post = await Post.findById('abc123')
  .populate('author')
  .populate('comments');
```

---

## 🆔 ObjectId in MongoDB

**ObjectId** is the default type for `_id` in MongoDB documents. It's a 12-byte unique identifier automatically generated by MongoDB when a document is created.

### Structure of an ObjectId

```
ObjectId("64b3f8a2c1d2e3f4a5b6c7d8")
         └──────── 24 hex chars ────────┘
```

It is made up of:

| Bytes | Content |
|---|---|
| 4 bytes | Unix timestamp (seconds since epoch) |
| 5 bytes | Random value (machine + process unique) |
| 3 bytes | Incrementing counter |

### Key Facts

- Every ObjectId is **globally unique** without a central coordinator
- You can extract the **creation timestamp** from an ObjectId
- ObjectIds are used as the default `_id` for all Mongoose documents

### Using ObjectId

```js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId, // ← ObjectId reference
    ref: 'User'
  }
});
```

### Extracting Creation Time from ObjectId

```js
const doc = await Post.findById('64b3f8a2c1d2e3f4a5b6c7d8');
console.log(doc._id.getTimestamp());
// Returns: 2023-07-16T... (the creation date)
```

### Comparing ObjectIds

```js
// Don't use == — ObjectIds are objects
doc._id == '64b3f8a2c1d2e3f4a5b6c7d8'   // ❌ unreliable

doc._id.equals('64b3f8a2c1d2e3f4a5b6c7d8') // ✅ correct
doc._id.toString() === '64b3f8a2c1d2e3f4a5b6c7d8' // ✅ also fine
```

### Creating an ObjectId Manually

```js
const { Types } = require('mongoose');
const id = new Types.ObjectId();
console.log(id.toString()); // generates a new unique ObjectId
```

---

## 📝 locals in EJS

`res.locals` is an object in Express that stores variables **available to all EJS templates** rendered during a request, without needing to pass them explicitly in every `res.render()` call.

### The Problem Without locals

```js
// Without res.locals — you repeat user/auth data in every route:
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user, isLoggedIn: true, appName: 'MyApp' });
});

app.get('/about', (req, res) => {
  res.render('about', { user: req.session.user, isLoggedIn: true, appName: 'MyApp' });
});
// This gets repetitive fast!
```

### The Solution: res.locals

Set variables **once** in middleware and they're available in **every template** rendered in that request:

```js
app.use((req, res, next) => {
  res.locals.appName = 'MyApp';
  res.locals.user = req.session.user || null;
  res.locals.isLoggedIn = !!req.session.user;
  next();
});

// Now your routes are clean:
app.get('/', (req, res) => {
  res.render('index'); // appName, user, isLoggedIn are automatically available
});

app.get('/about', (req, res) => {
  res.render('about'); // same variables, no need to pass them
});
```

### Using locals in EJS templates

**`views/navbar.ejs`:**
```ejs
<nav>
  <a href="/"><%- appName %></a>

  <% if (isLoggedIn) { %>
    <span>Welcome, <%= user.username %>!</span>
    <a href="/logout">Logout</a>
  <% } else { %>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  <% } %>
</nav>
```

### Full Example

```js
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

// Flash messages + auth middleware
app.use((req, res, next) => {
  res.locals.appName = 'DevNotes';
  res.locals.user = req.session?.user || null;
  res.locals.isLoggedIn = !!req.session?.user;
  res.locals.successMessage = req.flash?.('success') || null;
  res.locals.errorMessage = req.flash?.('error') || null;
  next();
});

app.get('/', (req, res) => {
  // We only pass page-specific data here
  res.render('index', { pageTitle: 'Home' });
});

app.get('/profile', (req, res) => {
  res.render('profile', { pageTitle: 'My Profile' });
});

app.listen(3000);
```

**`views/index.ejs`:**
```ejs
<%- include('partials/header') %>

<h1>Welcome to <%= appName %></h1>

<% if (successMessage) { %>
  <div class="alert alert-success"><%= successMessage %></div>
<% } %>

<% if (isLoggedIn) { %>
  <p>Hello, <%= user.username %>!</p>
<% } else { %>
  <p>Please <a href="/login">log in</a>.</p>
<% } %>

<%- include('partials/footer') %>
```

### locals vs Passing Data Directly

| | `res.locals` | `res.render(view, data)` |
|---|---|---|
| Scope | All templates in this request | Only the current template |
| Best for | Auth state, app name, flash messages | Page-specific data |
| Set in | Middleware | Route handler |

---

## 📚 Quick Reference Summary

| Concept | One-liner |
|---|---|
| EJS Partials | Reusable template fragments included with `<%- include() %>` |
| devDependencies | Packages for dev only; not installed in production |
| Salt | Random string added to password before hashing to ensure uniqueness |
| Crypto Hash | One-way function producing a fixed-length fingerprint of data |
| createHmac | Hash + secret key = verifiable, keyed hash |
| SHA-256 | Secure 256-bit hash algorithm from the SHA-2 family |
| Digest Hex | `.digest('hex')` — final hash output as a hexadecimal string |
| Mongoose Virtual | Computed property not stored in DB |
| Mongoose Static | Method on the Model class for queries/lookups |
| express.static | Built-in middleware to serve files from a folder |
| populate() | Replace ObjectId refs with real documents (like a JOIN) |
| ObjectId | MongoDB's unique 12-byte document identifier |
| res.locals | Express variables auto-available in all EJS templates for a request |

---