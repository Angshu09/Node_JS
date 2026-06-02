# WebSockets & Real-Time Communication — Notes

> A structured guide covering polling, WebSockets, and Socket.io with examples.

---

## 📡 1. Polling in Server and Client

**Polling** is a technique where the client repeatedly asks the server for new data at regular intervals.

There are two types:

- **Short Polling** — The client sends a request, the server responds immediately (even if there's no new data), and the client waits for a set interval before asking again.
- **Long Polling** — The client sends a request, and the server *holds* the connection open until new data is available, then responds. The client immediately sends a new request after receiving the response.

```
Client ──── GET /updates ───► Server
Client ◄─── response ───────── Server
(wait 1s...)
Client ──── GET /updates ───► Server
Client ◄─── response ───────── Server
```

---

## ⏱️ 2. Hit the Server Every Second (Short Polling Example)

```javascript
// Client-side: poll the server every second
setInterval(async () => {
  const response = await fetch('/api/messages');
  const data = await response.json();
  console.log('New data:', data);
}, 1000);
```

```javascript
// Server-side (Express.js)
app.get('/api/messages', (req, res) => {
  res.json({ messages: getLatestMessages() });
});
```

**Problems with this approach:**
- Wastes bandwidth — requests are made even when there's no new data.
- Adds unnecessary load to the server.
- Not truly real-time; there's always a delay equal to the interval.

---

## 🔄 3. Upgrading an HTTP Request

HTTP is a **request-response** protocol — the connection closes after each response. To enable real-time communication, we need to *upgrade* a regular HTTP connection to a persistent one.

The **WebSocket handshake** uses HTTP to start, then requests an upgrade:

```
Client → Server:
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

Server → Client:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

Once the server responds with **101 Switching Protocols**, the HTTP connection is *upgraded* to a WebSocket connection and both sides can communicate freely.

---

## 🌐 4. What is WebSocket?

**WebSocket** is a communication protocol that provides a **full-duplex** (two-way), **persistent** connection between a client and a server over a single TCP connection.

| Feature | HTTP | WebSocket |
|---|---|---|
| Connection | Opens and closes per request | Stays open |
| Direction | Client → Server only | Both ways (full-duplex) |
| Overhead | High (headers every request) | Low (after handshake) |
| Use case | Fetching pages, REST APIs | Chat, live feeds, gaming |

WebSocket URLs use `ws://` or `wss://` (secure).

```javascript
// Basic WebSocket on the client
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  console.log('Connected!');
  socket.send('Hello Server!');
};

socket.onmessage = (event) => {
  console.log('Message from server:', event.data);
};

socket.onclose = () => {
  console.log('Disconnected.');
};
```

---

## ❓ 5. What Problem Does WebSocket Solve?

Without WebSockets, real-time features (like chat apps, live notifications, or multiplayer games) had to rely on **polling**, which is:

- **Inefficient** — Constant HTTP requests even when nothing has changed.
- **Slow** — There's always a delay between when data is available and when the client gets it.
- **Resource-heavy** — Each HTTP request carries large headers, wasting bandwidth.

**WebSocket solves this by:**
- Keeping the connection open (no repeated handshakes).
- Allowing the **server to push data** to the client anytime — without the client asking.
- Reducing overhead after the initial handshake.

**Real-world use cases:**
- 💬 Live chat applications
- 📈 Stock market / live price feeds
- 🎮 Multiplayer online games
- 🔔 Real-time notifications
- 📝 Collaborative editing (like Google Docs)

---

## 🤝 6. Connection Establishment and Connection Close

### Connection Establishment
1. Client initiates an HTTP request with `Upgrade: websocket` header.
2. Server agrees and responds with `101 Switching Protocols`.
3. The TCP connection is now a **WebSocket tunnel** — both sides can send messages freely.

### Connection Close
Either side (client or server) can initiate a close by sending a **Close frame**.

```javascript
// Client closes the connection
socket.close(1000, 'Work done'); // code 1000 = normal closure

// Server-side close event
socket.on('close', (code, reason) => {
  console.log(`Connection closed: ${code} - ${reason}`);
});
```

**Common WebSocket Close Codes:**

| Code | Meaning |
|---|---|
| 1000 | Normal closure |
| 1001 | Going away (tab closed) |
| 1006 | Abnormal closure (no close frame) |
| 1011 | Server error |

---

## 📦 7. Socket.io for Node.js

**Socket.io** is a popular library built on top of WebSockets that adds:
- Automatic reconnection
- Fallback to HTTP long-polling if WebSocket isn't available
- Room and namespace support
- Built-in event system

### Installation

```bash
npm install socket.io        # for the server
npm install socket.io-client # for the client (if needed separately)
```

### Server Setup (Node.js + Express)

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## 📤 8. `emit` — Sending Events

`emit` is used to **send** an event with optional data to the other side.

```javascript
// Server emitting to a specific client
socket.emit('welcome', { message: 'Hello, user!' });

// Server emitting to ALL connected clients
io.emit('announcement', { message: 'Server is restarting in 5 mins' });

// Server emitting to all EXCEPT the sender
socket.broadcast.emit('user-joined', { id: socket.id });
```

```javascript
// Client emitting to the server
socket.emit('chat-message', { text: 'Hey there!' });
```

---

## 👂 9. `on` — Listening to Events

`on` is used to **listen** for an event and handle it when received.

```javascript
// Server listening for a custom event from the client
socket.on('chat-message', (data) => {
  console.log('Message received:', data.text);
});

// Client listening for an event from the server
socket.on('welcome', (data) => {
  console.log(data.message); // "Hello, user!"
});
```

---

## 🧪 10. A Little Example — Simple Chat App

### Server (`server.js`)

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for a message from the client
  socket.on('send-message', (data) => {
    console.log('Message:', data.text);

    // Broadcast the message to ALL other clients
    socket.broadcast.emit('receive-message', {
      from: socket.id,
      text: data.text,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Chat server running at http://localhost:3000');
});
```

### Client (`index.html`)

```html
<!DOCTYPE html>
<html>
  <head><title>Chat</title></head>
  <body>
    <input id="msg" placeholder="Type a message..." />
    <button onclick="sendMessage()">Send</button>
    <ul id="messages"></ul>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();

      function sendMessage() {
        const text = document.getElementById('msg').value;
        socket.emit('send-message', { text });
        document.getElementById('msg').value = '';
      }

      socket.on('receive-message', (data) => {
        const li = document.createElement('li');
        li.textContent = `${data.from}: ${data.text}`;
        document.getElementById('messages').appendChild(li);
      });
    </script>
  </body>
</html>
```

---
