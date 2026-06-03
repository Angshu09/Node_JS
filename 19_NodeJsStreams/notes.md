# 🌊 Node.js Streams — Notes

> A structured guide covering Streams, why they exist, how they work, and how to use them effectively in Node.js.

---

## 📌 1. What are Streams?

A **Stream** is a way to handle reading or writing data **piece by piece** (in chunks), rather than loading everything into memory all at once.

Think of it like a water pipe — water (data) flows through continuously, you don't wait for the entire tank to fill before using it.

```
Without Streams:
File (500MB) ──────────────────► RAM (500MB loaded) ──► Process

With Streams:
File ──► [chunk1] ──► Process
     ──► [chunk2] ──► Process
     ──► [chunk3] ──► Process
         (only one small chunk in memory at a time)
```

In Node.js, streams are instances of `EventEmitter` and are available via the built-in `stream` module.

---

## ❓ 2. Why Use Streams?

Streams exist because **not all data is small**. Consider:

- Reading a **2GB log file** to search for an error
- **Uploading a large video** to a server
- **Streaming audio/video** to a browser
- **Compressing** a huge file on the fly

Without streams, you'd have to load the entire file into RAM before doing anything with it — which is **slow, memory-hungry, and sometimes impossible**.

Streams let you **start processing data as soon as the first chunk arrives**, making your app faster and far more memory-efficient.

---

## 🔧 3. What Problem Do Streams Solve?

### Problem 1 — Memory Overflow

```javascript
// ❌ BAD — loads entire file into RAM
const data = fs.readFileSync('./huge-file.txt'); // could crash for large files
res.end(data);
```

```javascript
// ✅ GOOD — streams data chunk by chunk
fs.createReadStream('./huge-file.txt').pipe(res);
```

### Problem 2 — High Latency (Time To First Byte)

Without streams, the client waits until the **entire file is read** before it receives anything.

With streams, the client starts **receiving data immediately** as chunks arrive — much lower latency.

### Problem 3 — Blocking the Event Loop

Loading huge files synchronously blocks Node's event loop, making your server unresponsive. Streams are **asynchronous by nature** — they don't block.

---

## 🧩 4. Chunk of Data

A **chunk** is a small piece of data that a stream processes at a time.

- For **binary streams** (files, network), a chunk is a `Buffer` (raw bytes).
- For **object streams**, a chunk can be any JavaScript value.
- The default chunk size (highWaterMark) is **16KB** for byte streams.

```javascript
const fs = require('fs');

const readable = fs.createReadStream('./file.txt', { highWaterMark: 1024 }); // 1KB chunks

readable.on('data', (chunk) => {
  console.log(`Received chunk of size: ${chunk.length} bytes`);
  console.log(chunk.toString()); // convert Buffer to string
});

readable.on('end', () => {
  console.log('No more chunks — stream finished.');
});
```

Each `data` event fires once per chunk. The stream pauses after emitting a chunk and resumes after it's consumed (in flowing mode, it does this automatically).

---

## 📦 5. Transfer-Encoding: Chunked

When Node.js streams data over HTTP, the browser needs to know *how* the data is being sent — especially if the total size isn't known upfront.

**`Transfer-Encoding: chunked`** is an HTTP/1.1 header that tells the client:

> *"I'm sending data in pieces. Each piece starts with its size (in hex), followed by the data. An empty chunk (size = 0) means the stream is done."*

### How it looks on the wire:

```
HTTP/1.1 200 OK
Transfer-Encoding: chunked

1a\r\n                        ← chunk size in hex (1a = 26 bytes)
This is the first chunk.\r\n  ← chunk data
0d\r\n                        ← chunk size (0d = 13 bytes)
Second chunk.\r\n             ← chunk data
0\r\n                         ← size 0 = end of stream
\r\n
```

### Node.js sets this automatically when you stream to `res`:

```javascript
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // Node automatically adds Transfer-Encoding: chunked
  fs.createReadStream('./large-file.txt').pipe(res);
}).listen(3000);
```

You never have to manually set chunk headers — Node.js and the HTTP module handle this when you pipe a stream into the response.

---

## 🔗 6. Pipeline for Streams (`.pipe()` and `pipeline()`)

### `.pipe()`

`.pipe()` connects a **Readable** stream to a **Writable** stream, automatically managing the flow of data between them.

```javascript
readableStream.pipe(writableStream);
```

- Data flows from source → destination.
- Backpressure is handled automatically (if the writer is slow, the reader pauses).
- You can chain `.pipe()` calls through Transform streams.

```javascript
const fs = require('fs');

// Read a file and write it to another file
fs.createReadStream('./input.txt')
  .pipe(fs.createWriteStream('./output.txt'));
```

### `stream.pipeline()` (Recommended for Production)

`.pipe()` has a known issue — **errors are not automatically propagated** across the chain. If one stream errors, others may not close properly, causing memory leaks.

`stream.pipeline()` fixes this:

```javascript
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

pipeline(
  fs.createReadStream('./input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('./input.txt.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Pipeline succeeded!');
    }
  }
);
```

> ✅ Always prefer `stream.pipeline()` over chaining `.pipe()` in production code.

---

## 🗜️ 7. zlib — Compression with Streams

`zlib` is a built-in Node.js module for **compressing and decompressing** data. It exposes Transform streams that fit naturally into the stream pipeline.

### Common zlib methods:

| Method | Description |
|---|---|
| `zlib.createGzip()` | Compress data using Gzip format |
| `zlib.createGunzip()` | Decompress Gzip data |
| `zlib.createDeflate()` | Compress using Deflate algorithm |
| `zlib.createInflate()` | Decompress Deflate data |
| `zlib.createBrotliCompress()` | Compress using Brotli (better ratio) |

```javascript
const zlib = require('zlib');
const fs = require('fs');

// Compress a file
fs.createReadStream('./file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('./file.txt.gz'));

// Decompress a file
fs.createReadStream('./file.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('./file.txt'));
```

---

## 🔬 8. Breaking Down This Line of Code

```javascript
fs.createReadStream("./random_learning_text.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("./random_learning_text.zip"))
```

Let's read this left to right, step by step:

```
[File on Disk]
      │
      ▼
fs.createReadStream("./random_learning_text.txt")
  → Creates a Readable stream that reads the file in chunks (default 16KB each)
      │
      │  .pipe()
      ▼
zlib.createGzip()
  → A Transform stream — receives raw chunks, compresses them using Gzip,
    and outputs compressed chunks
      │
      │  .pipe()
      ▼
fs.createWriteStream("./random_learning_text.zip")
  → A Writable stream that receives the compressed chunks
    and writes them to a new file on disk
```

### What's happening under the hood:

1. `createReadStream` reads the `.txt` file in **16KB chunks**.
2. Each chunk is **piped into** `createGzip()`, which compresses it on the fly.
3. The compressed chunk is immediately **piped into** `createWriteStream`, which writes it to the `.zip` file.
4. At **no point** is the entire file held in memory — only one chunk exists in RAM at a time.

### Why is this powerful?

Imagine the `.txt` file is **500MB**. Without streams, you'd need 500MB of RAM just to read it, and another 500MB buffer to compress it.

With this one-liner, you compress a 500MB file using only **~16KB of RAM**.

> ⚠️ Note: `.zip` here is just the output filename — the actual compression format is **Gzip** (`.gz`). For true `.zip` format, you'd use the `archiver` or `jszip` npm package. The correct output extension should be `.txt.gz`.

---

## 🗂️ 9. Types of Streams in Node.js

Node.js has **4 fundamental types** of streams:

---

### 1. 📖 Readable Stream
A stream you can **read data from**.

**Examples:** `fs.createReadStream()`, `http.IncomingMessage`, `process.stdin`

```javascript
const fs = require('fs');
const readable = fs.createReadStream('./file.txt');

// Flowing mode — data flows automatically
readable.on('data', (chunk) => {
  process.stdout.write(chunk);
});

readable.on('end', () => console.log('\nDone reading.'));
readable.on('error', (err) => console.error('Error:', err));
```

**Two modes:**
- **Flowing mode** — data flows automatically via `data` event or `.pipe()`
- **Paused mode** — you manually call `.read()` to consume data

---

### 2. ✍️ Writable Stream
A stream you can **write data to**.

**Examples:** `fs.createWriteStream()`, `http.ServerResponse`, `process.stdout`

```javascript
const fs = require('fs');
const writable = fs.createWriteStream('./output.txt');

writable.write('Hello, ');
writable.write('World!\n');
writable.end(); // signals no more data will be written

writable.on('finish', () => console.log('All data written to file.'));
writable.on('error', (err) => console.error('Error:', err));
```

---

### 3. 🔄 Transform Stream
A stream that is **both Readable and Writable** — it **reads input, transforms it, and outputs** the result.

**Examples:** `zlib.createGzip()`, `crypto.createCipheriv()`, custom parsers

```javascript
const { Transform } = require('stream');

// Custom Transform: converts text to uppercase
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

process.stdin
  .pipe(upperCaseTransform)
  .pipe(process.stdout);
// Type "hello" → outputs "HELLO"
```

---

### 4. 🔁 Duplex Stream
A stream that is **both Readable and Writable**, but the two sides are **independent** (unlike Transform, the output is not derived from the input).

**Examples:** `net.Socket`, `WebSocket connections`, `TCP sockets`

```javascript
const net = require('net');

const server = net.createServer((socket) => {
  // socket is a Duplex stream — you can both read from and write to it
  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write('Echo: ' + data); // write back to the client
  });
});

server.listen(3000);
```

---

### Stream Types — Summary Table

| Type | Readable | Writable | Example |
|---|---|---|---|
| **Readable** | ✅ | ❌ | `fs.createReadStream()` |
| **Writable** | ❌ | ✅ | `fs.createWriteStream()` |
| **Transform** | ✅ | ✅ | `zlib.createGzip()` |
| **Duplex** | ✅ | ✅ | `net.Socket` |

> Transform is a **special type of Duplex** where the output is a function of the input.

---

## ⚡ 10. Backpressure

**Backpressure** is what happens when the **Writable stream is slower than the Readable stream** — data piles up in memory.

`.pipe()` handles backpressure automatically:
- When the writable buffer is full, `.pipe()` **pauses** the readable.
- When the writable drains, `.pipe()` **resumes** the readable.

```javascript
// Manual backpressure handling (without .pipe())
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  if (!canContinue) {
    readable.pause(); // slow down!
    writable.once('drain', () => {
      readable.resume(); // writable is ready again
    });
  }
});
```

This is one more reason to **always use `.pipe()` or `stream.pipeline()`** — they handle this for you.

---
