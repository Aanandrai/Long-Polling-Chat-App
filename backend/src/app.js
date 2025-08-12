import express from 'express';
import cors from 'cors';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes


app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;
