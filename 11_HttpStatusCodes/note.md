# HTTP Status Codes – Complete Guide

HTTP Status Codes are **three-digit numbers returned by a server** in response to a client’s request.
They indicate whether the request was **successful, redirected, failed, or had a server issue**.

These codes are a fundamental part of **HTTP communication** between the client (browser, API client) and the server.

---

# 1. Structure of HTTP Status Codes

HTTP status codes are divided into **five categories based on their first digit**.

| Code Range | Category      | Meaning                                     |
| ---------- | ------------- | ------------------------------------------- |
| 1xx        | Informational | Request received, continue processing       |
| 2xx        | Success       | Request successfully processed              |
| 3xx        | Redirection   | Further action required to complete request |
| 4xx        | Client Error  | Client made an invalid request              |
| 5xx        | Server Error  | Server failed to process request            |

---

# 2. 1xx – Informational Responses

These codes indicate that the request has been received and the process is continuing.

| Code | Name                | Purpose                                       |
| ---- | ------------------- | --------------------------------------------- |
| 100  | Continue            | Client should continue request                |
| 101  | Switching Protocols | Server switching protocols (HTTP → WebSocket) |
| 102  | Processing          | Request is being processed                    |

Example usage:

* Used during **large file uploads**
* Protocol upgrades like **WebSockets**

---

# 3. 2xx – Success Responses

These codes indicate the request was **successfully received and processed**.

| Code | Name       | Purpose                                      |
| ---- | ---------- | -------------------------------------------- |
| 200  | OK         | Request succeeded                            |
| 201  | Created    | Resource successfully created                |
| 202  | Accepted   | Request accepted but processing not finished |
| 204  | No Content | Request successful but no response body      |

### Example (API Response)

```id="2p7e5s"
HTTP/1.1 200 OK
Content-Type: application/json
```

Example response body:

```json
{
  "message": "User fetched successfully"
}
```

### Common Use Cases

| Status | Usage                         |
| ------ | ----------------------------- |
| 200    | GET request successful        |
| 201    | POST request created resource |
| 204    | DELETE request successful     |

---

# 4. 3xx – Redirection Responses

These codes indicate the requested resource has been **moved to another location**.

| Code | Name               | Purpose                              |
| ---- | ------------------ | ------------------------------------ |
| 301  | Moved Permanently  | Resource permanently moved           |
| 302  | Found              | Temporary redirect                   |
| 303  | See Other          | Redirect to another URL              |
| 304  | Not Modified       | Cached version can be used           |
| 307  | Temporary Redirect | Same method redirect                 |
| 308  | Permanent Redirect | Permanent redirect preserving method |

Example:

```id="kwrprn"
HTTP/1.1 301 Moved Permanently
Location: https://example.com/new-page
```

Usage:

* Website URL changes
* SEO redirects
* Domain migrations

---

# 5. 4xx – Client Error Responses

These codes indicate **an issue with the client request**.

| Code | Name                 | Purpose                 |
| ---- | -------------------- | ----------------------- |
| 400  | Bad Request          | Invalid request syntax  |
| 401  | Unauthorized         | Authentication required |
| 403  | Forbidden            | Access denied           |
| 404  | Not Found            | Resource not found      |
| 405  | Method Not Allowed   | HTTP method not allowed |
| 408  | Request Timeout      | Request took too long   |
| 409  | Conflict             | Request conflict        |
| 422  | Unprocessable Entity | Validation error        |
| 429  | Too Many Requests    | Rate limit exceeded     |

Example:

```id="k9i0s6"
HTTP/1.1 404 Not Found
Content-Type: application/json
```

Example response:

```json
{
  "error": "User not found"
}
```

Usage examples:

| Status | Situation                    |
| ------ | ---------------------------- |
| 400    | Invalid JSON body            |
| 401    | Missing authentication token |
| 403    | User has no permission       |
| 404    | API endpoint not found       |

---

# 6. 5xx – Server Error Responses

These codes indicate the **server failed to process the request**.

| Code | Name                  | Purpose                               |
| ---- | --------------------- | ------------------------------------- |
| 500  | Internal Server Error | Unexpected server error               |
| 501  | Not Implemented       | Feature not supported                 |
| 502  | Bad Gateway           | Invalid response from upstream server |
| 503  | Service Unavailable   | Server temporarily overloaded         |
| 504  | Gateway Timeout       | Upstream server timeout               |

Example:

```id="8kshq7"
HTTP/1.1 500 Internal Server Error
```

Usage:

* Server crash
* Database connection failure
* Application errors

---

# 7. HTTP Status Codes in Node.js (Express)

In **Node.js Express**, status codes can be sent using:

```javascript
res.status(code)
```

### Example – Success Response

```id="k8yk6i"
app.get("/users", (req, res) => {

  res.status(200).json({
    message: "Users fetched successfully"
  });

});
```

---

### Example – Resource Created

```id="y33owq"
app.post("/users", (req, res) => {

  res.status(201).json({
    message: "User created successfully"
  });

});
```

---

### Example – Not Found Error

```id="5l5z9h"
app.get("/user/:id", (req, res) => {

  res.status(404).json({
    error: "User not found"
  });

});
```

---

# 8. Common Status Codes Used in APIs

| Code | Usage                              |
| ---- | ---------------------------------- |
| 200  | Successful GET request             |
| 201  | Resource created                   |
| 204  | Successful request with no content |
| 400  | Bad client request                 |
| 401  | Authentication required            |
| 403  | Access forbidden                   |
| 404  | Resource not found                 |
| 409  | Conflict                           |
| 422  | Validation error                   |
| 500  | Server error                       |

---

# 9. Real API Example

Request:

```id="krs5ml"
GET /api/users/10
```

Possible responses:

### Success

```id="r8a8h4"
HTTP/1.1 200 OK
```

### User not found

```id="jy64kl"
HTTP/1.1 404 Not Found
```

### Server crash

```id="4y7oqf"
HTTP/1.1 500 Internal Server Error
```

---

# 10. Why HTTP Status Codes Are Important

HTTP status codes help:

* Communicate **request results**
* Handle **API errors properly**
* Improve **debugging**
* Manage **client-server communication**
* Implement **proper API standards**

Without status codes, clients would not know **whether a request succeeded or failed**.

---

# 11. Summary

* HTTP status codes indicate the **result of an HTTP request**.
* They are grouped into **five categories (1xx–5xx)**.
* APIs rely heavily on **2xx, 4xx, and 5xx** codes.
* In Node.js Express, status codes are sent using `res.status()`.

Understanding HTTP status codes is essential for **backend development, API design, and debugging web applications**.

---

# References

HTTP Status Code Documentation (MDN):

https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
