// routes to handle the requests related to car bookings and reviews
const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    checkForClashes, 
    activateBooking, 
    fetchBookingsByUser, 
    fetchOrdersByOwner,
    postRenterReview,
    postOnwerReview
} = require('../controllers/bookingController')

router.post('/createBooking', createBooking);
router.get('/checkForClashes/:carId', checkForClashes);
router.put('/activateBooking/:bookingId', activateBooking);
router.get('/fetchBookingsByUser/:userId', fetchBookingsByUser);
router.get('/fetchOrdersByOwner/:userId', fetchOrdersByOwner);
router.put('/postRenterReview/:bookingId', postRenterReview);
router.put('/postOwnerReview/:orderId', postOnwerReview);

module.exports = router;

