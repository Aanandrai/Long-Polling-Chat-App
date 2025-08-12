let clients = [];

export const sendMessage = (req, res) => {
  const { message, senderId, avatar, color } = req.body;

  if (!message || !senderId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const msgPayload = {
    message,
    senderId,
    avatar,
    color,
    timestamp: Date.now(), // ⏱ Add this line
  };

  // Respond to all pending long-poll clients immediately
  clients.forEach(({ res: clientRes, timer }) => {
    if (!clientRes.headersSent) {
      clearTimeout(timer);
      clientRes.json({ message: msgPayload });
    }
  });

  clients = [];
  res.status(200).json({ status: 'Message sent' });
};

export const pollMessages = (req, res) => {
  // Add this client’s res to clients list to hold response open
  clients.push({
    res,
    timer: setTimeout(() => {
      if (!res.headersSent) {
        res.json({ message: null }); // Timeout, no new messages
        clients = clients.filter(client => client.res !== res);
      }
    }, 30000), // 30 sec timeout
  });
};
