// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middlewares/authMiddleware');
const { encryptRequestBody } = require('../middlewares/encryptionMiddleware');

router.use(authenticate);

router.post('/', encryptRequestBody, messageController.sendMessage);
router.get('/conversation/:user_id', messageController.getConversation);
router.get('/recent', messageController.getRecentChats);

module.exports = router;