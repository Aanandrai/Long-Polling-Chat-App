const API_BASE = 'http://localhost:3000/api';
const EXPIRY_DURATION = 60 * 60 * 1000; // 1 hour
const HEARTBEAT_INTERVAL = 15000; // 15 seconds

// --- Load or generate persistent user data with expiry ---
let userId = localStorage.getItem('userId');
let userColor = localStorage.getItem('userColor');
let userAvatar = localStorage.getItem('userAvatar');
let savedAt = localStorage.getItem('savedAt');
const now = Date.now();

if (!userId || !savedAt || now - parseInt(savedAt, 10) > EXPIRY_DURATION) {
  userId = crypto.randomUUID();
  userColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  userAvatar = `https://i.pravatar.cc/150?u=${userId}`;

  localStorage.setItem('userId', userId);
  localStorage.setItem('userColor', userColor);
  localStorage.setItem('userAvatar', userAvatar);
  localStorage.setItem('savedAt', now.toString());
}

function updateExpiryTimestamp() {
  localStorage.setItem('savedAt', Date.now().toString());
}

// Update UI with user info
document.getElementById('userId').textContent = userId.slice(0, 8);
document.getElementById('userAvatar').src = userAvatar;

const messagesBox = document.getElementById('messages');
const usersList = document.getElementById('usersList');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      senderId: userId,
      avatar: userAvatar,
      color: userColor,
    }),
  });

  messageInput.value = '';
  updateExpiryTimestamp();
});

function appendMessage({ senderId, avatar, color, message, timestamp }) {
  const div = document.createElement('div');
  div.className = 'message';
  if (senderId === userId) div.classList.add('mine');
  else div.style.backgroundColor = color;

  const timeString = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  div.innerHTML = `
    <img src="${avatar}" alt="avatar" class="avatar" />
    <div class="message-content">
      <div class="message-header">
        <span>User: ${senderId.slice(0, 8)}</span>
        <span class="time">${timeString}</span>
      </div>
      <div class="message-body">${escapeHtml(message)}</div>
    </div>
  `;

  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Long polling for messages
async function startPollingMessages() {
  while (true) {
    try {
      const res = await fetch(`${API_BASE}/messages/poll`);
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          appendMessage(data.message);
        }
      }
    } catch (err) {
      console.warn('Message polling failed:', err.message);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

// Send heartbeat to server
function sendHeartbeat() {
  fetch(`${API_BASE}/users/heartbeat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      senderId: userId,
      avatar: userAvatar,
      color: userColor,
    }),
  })
    .then(() => updateExpiryTimestamp())
    .catch(() => {});
}

// Poll online users
async function pollOnlineUsers() {
  try {
    const res = await fetch(`${API_BASE}/users/online`);
    if (res.ok) {
      const data = await res.json();
      updateOnlineUsers(data.onlineUsers);
    }
  } catch (err) {
    console.warn('Failed to fetch online users:', err.message);
  }
}

// Update online users list UI
function updateOnlineUsers(users) {
  console.log('Online users:', users);
  usersList.innerHTML = '';
  users.forEach(user => {
    // Use senderId if present, else fallback to id or 'unknown'
    const userIdShort = (user.senderId || user.id || 'unknown').slice(0, 8);
    const avatar = user.avatar || '';
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${avatar}" alt="User avatar" />
      <span>${userIdShort}</span>
    `;
    usersList.appendChild(li);
  });
}

function init() {
  sendHeartbeat();
  pollOnlineUsers();

  // Repeat heartbeat every 15 seconds
  setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

  // Repeat online users polling every 10 seconds
  setInterval(pollOnlineUsers, 10000);

  // Start message polling
  startPollingMessages();
}

init();
