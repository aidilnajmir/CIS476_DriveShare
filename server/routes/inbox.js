// routes to handle the requests related to sending messages, fetching messages, and notifications
const express = require('express');
const router = express.Router();
const { 
    fetchAllMessages, 
    createMessage,  
    fetchMessagesByUser, 
    fetchChatRoomMessages, 
    getNotificationsByUser
} = require('../controllers/inboxController');

router.post('/messages', createMessage);
router.get('/messages', fetchAllMessages);
router.get('/messages/:userId', fetchMessagesByUser)
router.get('/messages/:userId/:recipientId', fetchChatRoomMessages);

router.get('/notifications/getNotificationsByUser/:userId', getNotificationsByUser);

module.exports = router;
