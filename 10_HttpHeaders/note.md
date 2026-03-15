# HTTP Headers – Complete Guide

HTTP headers are an important part of web communication. They provide **additional information about requests and responses** between the client and the server.

This document explains:

* What HTTP headers are
* Types of headers
* Built-in (standard) headers
* Custom headers
* How to use headers in Node.js / Express
* Purpose of common headers

---

# 1. What Are HTTP Headers?

HTTP headers are **key–value pairs** sent between a **client (browser)** and a **server** along with HTTP requests and responses.

They provide **metadata** about the request or response.

Example HTTP request:

```
GET /api/users HTTP/1.1
Host: example.com
User-Agent: Chrome
Accept: application/json
Authorization: Bearer token123
```

Here:

| Header        | Purpose                          |
| ------------- | -------------------------------- |
| Host          | Domain name of server            |
| User-Agent    | Information about browser/client |
| Accept        | Data format client accepts       |
| Authorization | Authentication token             |

---

# 2. Types of HTTP Headers

HTTP headers are mainly divided into four categories.

## 1. Request Headers

Sent by the **client to the server**.

Example:

```
GET /api/users
Accept: application/json
Authorization: Bearer token
User-Agent: Chrome
```

Common request headers:

* Accept
* Authorization
* User-Agent
* Cookie
* Referer
* Cache-Control

Purpose:

* Tell the server **what the client wants**.

---

## 2. Response Headers

Sent by the **server to the client**.

Example:

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 348
Cache-Control: no-cache
```

Common response headers:

* Content-Type
* Content-Length
* Cache-Control
* Set-Cookie
* Server

Purpose:

* Provide **information about the server response**.

---

## 3. General Headers

Used for **both request and response**.

Examples:

* Cache-Control
* Connection
* Date
* Via

Purpose:

* Control **overall HTTP communication behavior**.

---

## 4. Entity Headers

Describe the **content body of the message**.

Examples:

* Content-Type
* Content-Length
* Content-Encoding
* Content-Language

Purpose:

* Describe **the data being transferred**.

---

# 3. Built-in (Standard) HTTP Headers

Built-in headers are **predefined headers defined by the HTTP specification**.

These are automatically supported by browsers and servers.

Examples:

| Header        | Purpose                                 |
| ------------- | --------------------------------------- |
| Content-Type  | Defines type of data (JSON, HTML, etc.) |
| Authorization | Sends authentication credentials        |
| Accept        | Defines response formats accepted       |
| Cache-Control | Controls caching                        |
| User-Agent    | Identifies client application           |
| Cookie        | Sends stored cookies                    |
| Set-Cookie    | Sets cookies in browser                 |

Full list of headers (MDN documentation):

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

MDN provides a complete reference for all standard HTTP headers.

---

# 4. Custom HTTP Headers

Custom headers are **headers created by developers** for specific application logic.

They are **not part of the HTTP standard**.

Example:

```
X-App-Version: 1.0
X-User-Role: admin
X-Request-ID: 87346
```

Traditionally custom headers start with:

```
X-
```

But modern APIs may also use names without it.

Example:

```
App-Version: 1.0
Client-Type: mobile
```

Purpose of custom headers:

* API versioning
* Feature flags
* Request tracking
* User roles
* Internal communication between services

---

# 5. How HTTP Headers Work (Flow)

Step 1 — Client sends request with headers

```
GET /api/products
Authorization: Bearer token
Accept: application/json
```

Step 2 — Server reads headers and processes request

Step 3 — Server sends response headers

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache
```

Step 4 — Client receives response

---

# 6. Using HTTP Headers in Node.js

Node.js allows easy access to headers using the **req.headers** object.

Example using Express.

Install Express:

```
npm install express
```

---

## Reading Headers

```
const express = require("express");
const app = express();

app.get("/", (req, res) => {

    console.log(req.headers);

    const userAgent = req.headers["user-agent"];

    res.send("Header received: " + userAgent);

});

app.listen(3000);
```

Explanation:

* `req.headers` contains all request headers
* Access headers using bracket notation

Example output:

```
{
 host: 'localhost:3000',
 user-agent: 'Mozilla/5.0',
 accept: '*/*'
}
```

---

## Setting Response Headers

Server can send headers using:

```
res.set()
```

Example:

```
app.get("/", (req, res) => {

    res.set("Content-Type", "application/json");

    res.send({ message: "Hello World" });

});
```

---

## Sending Custom Headers

Example:

```
app.get("/api", (req, res) => {

    res.set("X-App-Version", "1.2.0");
    res.set("X-Server-Name", "NodeServer");

    res.send("Custom header sent");

});
```

Client can read these headers.

---

## Reading Custom Headers

Example request:

```
GET /api
X-User-Role: admin
```

Node.js code:

```
app.get("/api", (req, res) => {

    const role = req.headers["x-user-role"];

    res.send("User role is " + role);

});
```

Note:

Headers are **case-insensitive** in HTTP.

---

# 7. Commonly Used Headers in APIs

| Header        | Purpose              |
| ------------- | -------------------- |
| Authorization | Authentication token |
| Content-Type  | Data format          |
| Accept        | Response format      |
| Cache-Control | Caching rules        |
| Cookie        | Sends stored cookies |
| Set-Cookie    | Stores cookies       |
| User-Agent    | Client information   |

---

# 8. Why HTTP Headers Are Important

HTTP headers are used for:

* Authentication
* Content negotiation
* Security
* Caching
* Session management
* API versioning
* Client identification

Without headers, HTTP communication would lack important **context and control information**.

---

# 9. Summary

* HTTP headers are **metadata sent with HTTP requests and responses**.
* They are **key–value pairs**.
* There are **built-in headers defined by HTTP standards**.
* Developers can create **custom headers for application logic**.
* In Node.js, headers can be accessed using **req.headers** and set using **res.set()**.

---

# References

MDN HTTP Headers Documentation:

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
