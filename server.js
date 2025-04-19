const http = require('http');
const app = require('./app');
const SocketService = require('./services/socketService');
const db = require('./config/db');

// Start the server
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize WebSocket server
const socketService = new SocketService(server);
app.set('socketService', socketService);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});