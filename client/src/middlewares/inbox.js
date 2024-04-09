import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3001/inbox';

// Create a message function
export const createMessage = async (messageData) => {
  try {
    // POST request to create a new message
    await axios.post(`${API_ENDPOINT}/messages`, messageData);
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};

// Fetch all messages function
export const fetchAllMessages = async () => {
  try {
    // GET request to fetch all messages
    const response = await axios.get(`${API_ENDPOINT}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages. Please try again.');
  }
};

// Fetch messages (using userId) function
export const fetchMessagesByUser = async (userId) => {
  try {
    // GET request to fetch messages
    const response = await axios.get(`${API_ENDPOINT}/messages/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages by user:', error);
    throw new Error('Failed to fetch messages by user. Please try again.');
  }
}

// Fetch chat room messages (using userId, recipientId) function
// Fetch chat room messages (using userId, recipientId) function
export const fetchChatRoomMessages = async (userId, recipientId) => {
  try {
    // GET request to fetch chat room messages
    // GET request to fetch chat room messages
    const response = await axios.get(`${API_ENDPOINT}/messages/${userId}/${recipientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat room messages:', error);
    throw new Error('Failed to fetch chat room messages. Please try again.');
  }
}

// Fetch notifications (using userId) function
// Fetch notifications (using userId) function
export const getNotificationsByUser = async (userId) => {
  try {
    // GET request to fetch notifications
    const response = await axios.get(`${API_ENDPOINT}/notifications/getNotificationsByUser/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications. Please try again.');
  }
}