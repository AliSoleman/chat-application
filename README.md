# chat-application
A secure Real-Time Chat Application Backend

## Features : 
- 🔐 User Authentication - JWT-based registration and login
- 💬 Real-time Messaging - Instant message delivery using WebSockets
- 👥 User Management - User profiles and conversation tracking
- 🕒 Message History - Persistent message storage and retrieval
- 📱 RESTful API - Clean API endpoints for all operations 

### Tech : 
- Backend Framework: Express.js
- Database: PostgreSQL
- Real-time Communication: WebSocket (ws library)
- Authentication: JSON Web Tokens (JWT)
- Password Hashing: bcrypt

#### API Endpoints :
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get JWT token
- GET /api/auth/me - Get current user info (requires authentication)
- POST /api/messages - Send a message (requires authentication)
- GET /api/messages/conversation/:user_id - Get conversation with a specific user (requires authentication)
- GET /api/messages/recent - Get recent chats (requires authentication)