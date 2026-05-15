# 📘 Multer Notes - File Uploads in Node.js

---

# 🔹 1. What is Multer?

## 📌 Definition

`multer` is a Node.js middleware used for handling `multipart/form-data`, mainly for uploading files.

It works with Express.js applications.

---

## ✅ Uses of Multer

* Upload images
* Upload PDFs
* Upload videos
* Store files in server folders
* Handle file data from forms

---

## 📦 Install Multer

```bash id="aqcl5z"
npm install multer
```

---

# 🔹 2. What is `enctype="multipart/form-data"`?

## 📌 Definition

`multipart/form-data` is a form encoding type used when uploading files through HTML forms.

Without this, files cannot be sent properly to the server.

---

## 🧾 Syntax

```html id="f42u9w"
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="profile" />
  <button type="submit">Upload</button>
</form>
```

---

## ⚠️ Important

Whenever uploading files, always use:

```html id="j4lr71"
enctype="multipart/form-data"
```

---

# 🔹 3. Basic Multer Usage

## 📌 Example

```js id="d1k95p"
const express = require("express");
const multer = require("multer");

const app = express();

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("profile"), (req, res) => {
  console.log(req.file);
  res.send("File uploaded");
});

app.listen(3000);
```

---

## 📌 Explanation

### `upload.single("profile")`

* Uploads one file
* `"profile"` should match input name

---

## 📌 Access Uploaded File

```js id="vt6d5e"
req.file
```

---

# 🔹 4. Multer Storage

## 📌 Definition

Storage decides:

* Where files will be stored
* What file names will be used

---

## ✅ Types of Storage

| Storage Type   | Description            |
| -------------- | ---------------------- |
| Memory Storage | Stores in RAM          |
| Disk Storage   | Stores in local folder |

---

# 🔹 5. Multer diskStorage

## 📌 Definition

`diskStorage` is used to customize:

* Destination folder
* File name

---

## 🧾 Syntax

```js id="znzjca"
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });
```

---

# 🔹 6. Complete Example

## 🧾 Backend

```js id="18cvgr"
const express = require("express");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  res.send("Image uploaded successfully");
});

app.listen(3000);
```

---

## 🧾 Frontend Form

```html id="i90p1v"
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="image" />
  <button type="submit">Upload</button>
</form>
```

---

# 🔹 7. Important Multer Methods

| Method     | Purpose                          |
| ---------- | -------------------------------- |
| `single()` | Upload one file                  |
| `array()`  | Upload multiple files            |
| `fields()` | Upload multiple different fields |

---

## 🧾 Examples

### Single File

```js id="h7ks7m"
upload.single("image")
```

---

### Multiple Files

```js id="9d96t8"
upload.array("images", 5)
```

---

### Multiple Fields

```js id="j76c1g"
upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 5 }
])
```

---

# 🔹 8. File Information

## 📌 `req.file`

Contains uploaded file data.

---

## 🧾 Example

```js id="f4ccl8"
console.log(req.file);
```

---

## ✅ Common Properties

| Property     | Meaning            |
| ------------ | ------------------ |
| originalname | Original file name |
| filename     | Stored file name   |
| mimetype     | File type          |
| size         | File size          |

---

# 🔹 9. Why Multer is Important

* Simplifies file uploads
* Handles multipart data
* Supports custom storage
* Works easily with Express

---

# 🔹 10. Common Interview Questions

## ❓ Why use Multer?

To handle file uploads in Express applications.

---

## ❓ Why use `multipart/form-data`?

To send files properly from frontend to backend.

---

## ❓ Difference between memoryStorage and diskStorage?

| memoryStorage | diskStorage      |
| ------------- | ---------------- |
| Stores in RAM | Stores in folder |
| Temporary     | Permanent        |

---

# ✅ Final Summary

* `multer` → file upload middleware
* `multipart/form-data` → form encoding for files
* `diskStorage` → customize upload folder and file names
* `req.file` → uploaded file information
* `single()` → one file upload
* `array()` → multiple file uploads

---
