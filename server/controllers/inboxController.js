const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');

// function to handle the creation of a new message given the senderId, recipientId, and message content
const createMessage = async (req, res) => {
  try {
    // Extract the senderId, recipientId, and content from the request body
    const { sender, recipient, content } = req.body;
    const message = new Message({ sender, recipient, content });
    // Save the message to the database
    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// function to fetch all messages from the database
const fetchAllMessages = async (req, res) => {
  try {
    // Find all messages in the database and sort them by the createdAt field in descending order
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// function to fetch messages by a specific user
const fetchMessagesByUser = async (req, res) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;
    // Find the messages that involves the userId as either the sender or recipient
    const messages = await Message.find({ $or: [{ recipient: userId }, { sender: userId }] }).sort({ createdAt: -1 });

    //Find the name of the target user for each message to pass the user name into the response object
    const updatedMessages = await Promise.all(messages.map(async (message) => {
      let user;
      // If the current iser is a sender, the target user will be recipient, and vice versa
      if (message.sender.toString() === userId.toString()) {
        user = await User.findById(message.recipient);
      } else {
        user = await User.findById(message.sender);
      }
    
      return {
        ...message.toObject(),
        targetName: user.name
      };
    }));

    res.json(updatedMessages);
  } catch (error) {
    console.error('Error fetching messages by user:', error);
    res.status(500).json({ message: 'Error fetching messages by user' });
  }
}

// function to fetch the chat room messages between two users and sort them by the createdAt field in ascending order
const fetchChatRoomMessages = async (req, res, next) => {
  try {
    const { userId, recipientId } = req.params;
    // Find the messages that invovles the userId and recipientId as either the sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat room messages:', error);
    res.status(500).json({ message: 'Error fetching chat room messages' });
  }

}

// function to  fetch all notifications of a user
const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find the notifications for the user and sort them by the timestamp field in descending order
    const notifications = await Notification.find({ recipient: userId }).sort({ timestamp: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

module.exports = {
  fetchAllMessages,
  createMessage,
  fetchMessagesByUser,
  fetchChatRoomMessages,
  getNotificationsByUser
};
