// userController.js
const onlineUsers = new Map(); // userId => { avatar, color, lastActive }
const now = Date.now();
const ONLINE_TIMEOUT = 30 * 1000; // 30 seconds

// Cleanup inactive users every 10 seconds
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of onlineUsers.entries()) {
    if (now - data.lastActive > ONLINE_TIMEOUT) {
      onlineUsers.delete(userId);
    }
  }
}, 10 * 1000);

export const heartbeat = (req, res) => {
  const { senderId, avatar, color } = req.body;

  if (!senderId) {
    return res.status(400).json({ error: 'Missing senderId' });
  }

  onlineUsers.set(senderId, { avatar, color, lastActive: Date.now() });
  res.json({ status: 'OK' });
};

export const getOnlineUsers = (req, res) => {
  const users = Array.from(onlineUsers.entries()).map(([id, info]) => ({
    id,
    avatar: info.avatar,
    color: info.color,
  }));
  res.json({ onlineUsers: users });
};

// export const getOnlineUsers = (req, res) => {
//   const now = Date.now();

//   const users = Array.from(onlineUsers.entries())
//     .filter(([_, info]) => now - info.lastActive <= ONLINE_TIMEOUT)
//     .map(([id, info]) => ({
//       id,
//       avatar: info.avatar,
//       color: info.color,
//     }));

//   res.json({ onlineUsers: users });
// };