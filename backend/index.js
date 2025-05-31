import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import aitopiaRoutes from './routes/aitopia.route.js';
import alertRoutes from './routes/alert.route.js'; // 👈 new
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Alert from './models/alert.model.js'; // 👈 for socket

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://auth-lifecycle.vercel.app'],
    credentials: true
  }
});

// Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ['http://localhost:5173', 'https://auth-lifecycle.vercel.app'].includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/aitopia', aitopiaRoutes);
app.use('/api/alerts', alertRoutes); // 👈 new

// Static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Hello World 123');
  });
}

// Socket.IO (basic)
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('reportAlert', async (alertData) => {
    try {
      const alert = new Alert(alertData);
      await alert.save();
      io.emit('newAlert', alert); // broadcast to all users
    } catch (error) {
      console.error('Socket error saving alert:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
