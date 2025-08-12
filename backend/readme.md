# 📡 Long Polling with Node.js + Express

This project demonstrates how to implement **long polling** in a Node.js + Express server using **ES module syntax** (`"type": "module"` in `package.json`).

Long polling enables the server to push messages to the client **as soon as they are available**, while maintaining HTTP compatibility.

---

## 📁 Folder Structure

/Long-pooling
│
├── controllers/
│ └── messageController.js # Core logic for polling and sending messages
| └── messageController.js # Core logic for polling and sending messages
│
├── routes/
│ └── messageRoutes.js # API endpoints
│
├── app.js # Express app config
├── index.js # App entry point
├── package.json
├── readme.md 



---



## ✅ High-Level Workflow

1. **Client** calls: `GET /api/messages/poll`  
   → The server **holds the connection open** and stores the response in a `clients[]` array.

2. Another **client** sends: `POST /api/messages` with `{ message: "Hello" }`  
   → The server sends the message to all waiting clients.

3. All long-polling clients receive the message and **reconnect immediately**, creating a loop.

---

## 🧠 Controller Logic

### `getMessages(req, res)`: Long Polling Endpoint

- **What it does:**  
  Listens for incoming `GET` requests and **does not immediately respond**.

- **Flow:**
  1. Saves the client's `res` object in a `clients[]` array.
  2. Keeps the connection open, waiting for a message.
  3. Adds `req.on('close', ...)`:
     - Cleans up if the client disconnects (prevents memory leaks).

---

### `sendMessage(req, res)`: Message Dispatcher

- **What it does:**  
  Accepts `POST` requests to send a message to all waiting clients.

- **Flow:**
  1. Extracts and validates the message from `req.body`.
     - Returns `400 Bad Request` if message is missing.
  2. Loops over `clients[]` and calls `res.json({ message })` for each one.
  3. Clears the `clients[]` array.
  4. Sends a success response to the original sender.

---

## 🌐 Frontend Considerations

### ❓ Does Long Polling Block Other Frontend Requests?

✅ **No**, long polling **does not block** other requests by default.

### ✅ Why Not?

- **Modern browsers** can handle multiple concurrent HTTP requests:
  - Typically **6–10 per domain**.
- A long polling call just uses **one slot**.
- Other API calls (`POST`, `GET`, etc.) can happen **in parallel**.
- JavaScript event loop and `fetch`/`XMLHttpRequest` are **non-blocking**.

> ✔️ Long polling **does not** block the event loop  
> ✔️ But **bad design** or hitting browser connection limits **can** cause issues  
> ✔️ Solution: Use efficient long polling strategies

---

## ⏱ Recommended Server Timeout

### ⏳ Server-Side Handling

- Timeout after **20–30 seconds**, even if **no message** is available.
- Respond with:
  - `{ message: null }`,  
  - `"no updates"`, or  
  - an empty JSON (`{}`).

- The **client should immediately re-send** the polling request to keep the cycle going.

---

## 🔁 Why Set a Timeout?

- ✅ Prevents hanging connections.
- ✅ Ensures clients re-sync regularly.
- ✅ Reduces risk of memory/resource leaks on server/browser.
- ✅ Enables error recovery if the server crashes or the connection is lost.

---

## 🚫 What If You Don’t Handle Timeouts?

- ❌ Browser may hold the request **forever**.
- ❌ If server crashes or disconnects, **client won’t know**.
- ❌ Causes **memory leaks** and **poor user experience**.

---

## 💬 API Endpoints

```http
GET  /api/messages/poll      →  Initiates long polling
POST /api/messages           →  Sends a message to waiting clients
