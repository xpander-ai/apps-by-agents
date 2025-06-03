const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory log storage per endpoint ID
const logs = {};

// Parse JSON bodies
app.use(express.json());
// Serve static frontend files
app.use(express.static('public'));

// Webhook endpoint
app.post('/webhook/:id', (req, res) => {
  const { id } = req.params;
  const timestamp = new Date().toISOString();
  const entry = { timestamp, headers: req.headers, body: req.body };
  if (!logs[id]) logs[id] = [];
  logs[id].push(entry);
  io.to(id).emit('log', entry);
  res.sendStatus(200);
});

// Socket.IO connection for live logs
io.on('connection', (socket) => {
  const id = socket.handshake.query.id;
  if (id) {
    socket.join(id);
    // Send existing logs for this ID
    if (logs[id]) {
      logs[id].forEach((entry) => socket.emit('log', entry));
    }
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});