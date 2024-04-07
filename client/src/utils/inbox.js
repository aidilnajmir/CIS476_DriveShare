import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3001';

export const fetchMessages = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages. Please try again.');
  }
};

export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/notifications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications. Please try again.');
  }
};
