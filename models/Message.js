const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/cryptoUtils');

class Message {
  static async create({ sender_id, receiver_id, content }) {
    // Encrypt the message content before storing
    const encryptedContent = encrypt(content);
    
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, sender_id, receiver_id, created_at
    `;
    const values = [sender_id, receiver_id, encryptedContent];
    const { rows } = await db.query(query, values);
    
    return {
      ...rows[0],
      content 
    };
  }

  static async getConversation(user1_id, user2_id) {
    const query = `
      SELECT id, sender_id, receiver_id, content, created_at
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `;
    const { rows } = await db.query(query, [user1_id, user2_id]);
    
    // Decrypt all messages
    return rows.map(row => ({
      ...row,
      content: decrypt(row.content)
    }));
  }

  static async getRecentChats(user_id) {
    const query = `
      SELECT DISTINCT ON (u.id) 
        u.id as user_id, 
        u.username,
        m.content,
        m.created_at
      FROM users u
      JOIN messages m ON (m.sender_id = u.id OR m.receiver_id = u.id)
      WHERE (m.sender_id = $1 OR m.receiver_id = $1) AND u.id != $1
      ORDER BY u.id, m.created_at DESC
    `;
    const { rows } = await db.query(query, [user_id]);
    
    return rows.map(row => ({
      user_id: row.user_id,
      username: row.username,
      content: row.content ? decrypt(row.content) : null,
      created_at: row.created_at
    }));
  }
}

module.exports = Message;