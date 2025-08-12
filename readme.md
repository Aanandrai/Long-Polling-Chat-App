# 💬 Long Polling Chat App

A simple real-time chat application using **Node.js**, **Express**, and **long polling** for instant message delivery—no WebSockets required!  
Includes a modern frontend and a backend API, all runnable locally.

---

## 🗂 Project Structure

```
Long-Polling-Chat-App/
├── backend/         # Node.js/Express API server (long polling)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── messageController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── messageRoutes.js
│   │   │   └── userRoutes.js
│   │   └── app.js
│   ├── index.js
│   ├── package.json
│   └── ...
├── frontend/        # Static frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── script.js
│   └── style.css
└── readme.md        # (this file)
```

---

## 🚀 Getting Started

### 1. Start the Backend

```sh
cd backend
npm install
npm start
```
The backend will run on [http://localhost:3000](http://localhost:3000).

### 2. Open the Frontend

Open `frontend/index.html` in your browser (or use a simple static server).

---

## 📝 Features

- **Real-time chat** using HTTP long polling (no WebSockets)
- **Online users** list with avatars and colors
- **User persistence** (ID, avatar, color) via `localStorage`
- **Responsive UI** with modern design
- **No database required** (in-memory only)

---

## 🌐 API Endpoints

- `POST   /api/messages` — Send a new chat message
- `GET    /api/messages/poll` — Long poll for new messages
- `POST   /api/users/heartbeat` — Notify server user is online
- `GET    /api/users/online` — Get list of online users

---

## 🧠 How Long Polling Works

1. **Client** sends a `GET /api/messages/poll` request.
2. **Server** holds the request open until a new message arrives or a timeout occurs.
3. When a message is sent (`POST /api/messages`), the server responds to all waiting clients.
4. Clients immediately re-issue the poll request, creating a real-time loop.

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express, ES Modules
- **Frontend:** HTML, CSS, Vanilla JS

---

## 📦 Notes

- All data is stored in memory—restarting the server will clear messages and users.
- Designed for demo, learning, or small group chat use.

---