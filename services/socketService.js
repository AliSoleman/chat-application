const WebSocket = require('ws');
const { verifyToken } = require('../utils/jwtUtils');

class SocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // user_id -> WebSocket
    
    this.wss.on('connection', (ws, req) => {
      // Extract token from query parameters
      const token = req.url.split('token=')[1];
      
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }
      
      try {
        const { id } = verifyToken(token);
        this.clients.set(id, ws);
        
        ws.on('close', () => {
          this.clients.delete(id);
        });
        
        ws.on('error', (err) => {
          console.error('WebSocket error:', err);
          this.clients.delete(id);
        });
        
      } catch (err) {
        console.error('WebSocket authentication failed:', err);
        ws.close(1008, 'Invalid token');
      }
    });
  }
  
  sendMessage(message) {
    const { to, from, content, timestamp } = message;
    
    // Send to receiver if online
    if (this.clients.has(to)) {
      this.clients.get(to).send(JSON.stringify({
        type: 'message',
        data: {
          from,
          content,
          timestamp
        }
      }));
    }
    
    // Also send back to sender for their own UI update
    if (this.clients.has(from)) {
      this.clients.get(from).send(JSON.stringify({
        type: 'message',
        data: {
          to,
          content,
          timestamp
        }
      }));
    }
  }
  
  broadcastOnlineStatus(userId, isOnline) {
    this.clients.forEach((ws, clientId) => {
      if (clientId !== userId) {
        ws.send(JSON.stringify({
          type: 'presence',
          data: {
            userId,
            isOnline
          }
        }));
      }
    });
  }
}

module.exports = SocketService;