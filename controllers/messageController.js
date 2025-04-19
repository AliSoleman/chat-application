const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;
    
    const message = await Message.create({ sender_id, receiver_id, content });
    
    // Notify via WebSocket
    req.app.get('socketService').sendMessage({
      from: sender_id,
      to: receiver_id,
      content,
      timestamp: new Date()
    });
    
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { user_id } = req.params;
    const current_user_id = req.user.id;
    
    const messages = await Message.getConversation(current_user_id, user_id);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentChats = async (req, res) => {
  try {
    const current_user_id = req.user.id;
    const chats = await Message.getRecentChats(current_user_id);
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};