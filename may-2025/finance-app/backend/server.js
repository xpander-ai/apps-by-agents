require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const portfolioRoutes = require('./routes/portfolio');
const budgetRoutes = require('./routes/budget');
const expenseRoutes = require('./routes/expenses');
const { authenticateSocket } = require('./middleware/auth');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-app')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/expenses', expenseRoutes);

// Socket.io setup
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join user to their personal room
  if (socket.user) {
    socket.join(`user-${socket.user.id}`);
  }
  
  // Handle real-time data updates
  socket.on('subscribe-market-data', () => {
    // Simulate market data updates every 5 seconds
    const marketInterval = setInterval(() => {
      const marketData = generateMarketData();
      socket.emit('market-update', marketData);
    }, 5000);
    
    socket.on('disconnect', () => {
      clearInterval(marketInterval);
    });
  });
  
  // Handle portfolio updates
  socket.on('portfolio-update', async (data) => {
    try {
      // Update portfolio in database
      // Broadcast to all connected devices of this user
      io.to(`user-${socket.user.id}`).emit('portfolio-changed', data);
    } catch (error) {
      socket.emit('error', { message: 'Failed to update portfolio' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Generate mock market data
function generateMarketData() {
  return {
    timestamp: new Date(),
    indices: {
      sp500: 4800 + (Math.random() * 100 - 50),
      nasdaq: 16000 + (Math.random() * 200 - 100),
      dowJones: 38000 + (Math.random() * 300 - 150)
    },
    topMovers: [
      { symbol: 'AAPL', price: 180 + (Math.random() * 10 - 5), change: (Math.random() * 6 - 3).toFixed(2) },
      { symbol: 'MSFT', price: 350 + (Math.random() * 15 - 7.5), change: (Math.random() * 5 - 2.5).toFixed(2) },
      { symbol: 'GOOGL', price: 140 + (Math.random() * 8 - 4), change: (Math.random() * 4 - 2).toFixed(2) },
      { symbol: 'AMZN', price: 170 + (Math.random() * 12 - 6), change: (Math.random() * 7 - 3.5).toFixed(2) },
      { symbol: 'TSLA', price: 220 + (Math.random() * 20 - 10), change: (Math.random() * 8 - 4).toFixed(2) }
    ]
  };
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };