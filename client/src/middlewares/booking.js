import axios from 'axios';

const BASE_URL = 'http://localhost:3001/booking';

// Fetch bookings function (using userId)
export const fetchBookingsByUser = async (userId) => {
  try {
    // GET request to fetch bookings
    const response = await axios.get(`${BASE_URL}/fetchBookingsByUser/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch orders function (using userId)
export const fetchOrdersByOwner = async (userId) => {
  try {
    // GET request to fetch orders
    const response = await axios.get(`${BASE_URL}/fetchOrdersByOwner/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Post renter review function
export const postRenterReview = async (bookingId, rating, feedback) => {
  try {
    // PUT request to post renter review
    await axios.put(`${BASE_URL}/postRenterReview/${bookingId}`, { rating, feedback });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Post car owner review function
export const postOwnerReview = async (orderId, rating, feedback) => {
  try {
    // PUT request to post owner review
    await axios.put(`${BASE_URL}/postOwnerReview/${orderId}`, { rating, feedback });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
