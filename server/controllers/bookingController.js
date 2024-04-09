const cron = require('node-cron');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Car = require('../models/Car');
const NotificationObserver = require('../utils/observer/NotificationObserver');
const Subject = require('../utils/observer/Subject');

// Create an instance of BookingSubject and NotificationObserver
const BookingSubject = new Subject();
const notificationObserver = new NotificationObserver(BookingSubject);

// Function to create a new booking
const createBooking = async (req, res) => {
  try {
    // Extract data from request body
    const { renterId, carId, startDate, endDate, ownerId } = req.body;
    // Create a new Booking instance
    const booking = new Booking({ renterId, carId, startDate, endDate, status: 'REQUESTED' });
    // Save the booking to the database
    await booking.save();
    // Update booking status
    await updateBookingStatus();
    
    // Extract the ID of the newly created booking
    const bookingId = booking._id;

    // Fetch car details
    const car = await Car.findById(carId);
    const carName = car ? `${car.make} ${car.model}` : 'Unknown Car'; // Get the car name

    // Concatenate car name with the message
    const renterMessage = `Your booking for ${carName} was successful`;
    const ownerMessage = `Your car (${carName}) has been booked`;

    // Notify users about the booking
    BookingSubject.notifyObservers(renterId, renterMessage);
    BookingSubject.notifyObservers(ownerId, ownerMessage);

    // Send the booking ID in the response
    res.status(201).json({ bookingId, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Function to check for booking clashes
const checkForClashes = async (req, res) => {
  try {
    // Extract parameters from request
    const { carId } = req.params;
    const { startDate, endDate } = req.query;

    // Find bookings that clash with the requested dates
    const clashes = await Booking.find({
      carId,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gte: startDate } },
        { startDate: { $lte: endDate }, endDate: { $gt: startDate } }
      ]
    });

    // Return clashes in the response
    res.status(200).json({ clashes });
  } catch (error) {
    console.error('Error checking for clashes:', error);
    res.status(500).json({ error: 'Failed to check for clashes' });
  }
};

// Function to update booking status
const updateBookingStatus = async () => {
  try {
    const now = new Date();
    // Update status of bookings based on current date
    await Booking.updateMany(
      { endDate: { $lt: now }, status: { $ne: 'COMPLETED' } },
      { $set: { status: 'COMPLETED' } }
    );
    await Booking.updateMany(
      { startDate: { $lt: now }, endDate: { $gte: now }, status: { $ne: 'ACTIVE' } },
      { $set: { status: 'ACTIVE' } }
    );
  } catch (error) {
    console.error('Error updating booking status:', error);
  }
};

// Schedule the updateBookingStatus function to run every minute
cron.schedule('* * * * *', updateBookingStatus);

// Function to activate a booking
const activateBooking = async (req, res) => {
  try {
    // Extract booking ID from request parameters
    const { bookingId } = req.params;
    // Update booking status to ACTIVE
    await Booking.findByIdAndUpdate(bookingId, { status: 'ACTIVE' });
    res.status(200).json({ message: 'Booking activated successfully' });
  } catch (error) {
    console.error('Error activating booking:', error);
    res.status(500).json({ error: 'Failed to activate booking' });
  }
};

// Function to fetch bookings by user
const fetchBookingsByUser = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const { userId } = req.params;
    // Find all bookings related to the user
    const allBookings = await Booking.find({ renterId: userId });

    // Filter active and past bookings
    const now = new Date();
    const activeBookings = await Promise.all(
      allBookings
        .filter(booking => booking.endDate > now)
        .map(async booking => {
          const car = await Car.findById(booking.carId).select('make model year pickUpLocation owner');
          const owner = await User.findById(car.owner).select('name');
          return { ...booking.toObject(), car, owner };
        })
    );

    const pastBookings = await Promise.all(
      allBookings
        .filter(booking => booking.endDate <= now)
        .map(async booking => {
          const car = await Car.findById(booking.carId).select('make model year pickUpLocation owner');
          const owner = await User.findById(car.owner).select('name _id');
          return { ...booking.toObject(), car, owner };
        })
    );
    
    // Return active and past bookings
    res.json({ activeBookings, pastBookings });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
};

// Function to fetch orders by owner
const fetchOrdersByOwner = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const { userId } = req.params;
    // Find owner details
    const owner = await User.findById(userId);
    // Find cars owned by the user
    const cars = await Car.find({ owner: owner._id }).select('make model year pickUpLocation owner');
    const carIds = cars.map(car => car._id); // Extract unique carIds

    // Find orders related to the cars
    const allOrders = await Booking.find({ carId: { $in: carIds } });
    
    const now = new Date();
    // Filter active and past orders
    const activeOrders = await Promise.all(
      allOrders
        .filter(order => order.endDate > now)
        .map(async order => {
          const renter = await User.findById(order.renterId).select('name _id');
          const car = cars.find(car => car._id.equals(order.carId));
          return { ...order.toObject(), car, renter };
        })
    );

    const pastOrders = await Promise.all(
      allOrders
        .filter(order => order.endDate <= now)
        .map(async order => {
          const renter = await User.findById(order.renterId).select('name');
          const car = cars.find(car => car._id.equals(order.carId));
          return { ...order.toObject(), car, renter };
        })
    );
    
    // Return active and past orders
    res.json({ activeOrders, pastOrders });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Error retrieving orders' });
  }
};

// Function to post renter's review
const postRenterReview = async (req, res) => {
  try {
    // Extract booking ID from request parameters
    const { bookingId } = req.params;
    // Extract rating and feedback from request body
    const { rating, feedback } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the booking with the review data
    booking.renterReview = { rating, feedback };
    await booking.save();

    // Fetch the details of the booked car
    const car = await Car.findById(booking.carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const carName = car ? `${car.make} ${car.model}` : 'Unknown Car'; // Get the car name

    // Notify the owner about the renter's review
    const ownerMessage = `The renter has submitted a review for the ${carName} booking`;
    BookingSubject.notifyObservers(car.owner, ownerMessage);
    
    res.status(200).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to post owner's review
const postOnwerReview = async (req, res) => {
  try {
    // Extract order ID from request parameters
    const { orderId } = req.params;
    // Extract rating and feedback from request body
    const { rating, feedback } = req.body;

    // Find the booking by ID
    const order = await Booking.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the booking with the review data
    order.ownerReview = { rating, feedback };
    await order.save();

    // Fetch the details of the booked car
    const car = await Car.findById(order.carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const carName = car ? `${car.make} ${car.model}` : 'Unknown Car'; // Get the car name

    // Notify the renter about the owner's review
    const renterMessage = `The owner has submitted a review for the ${carName} booking`;
    BookingSubject.notifyObservers(order.renterId, renterMessage);

    res.status(200).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  checkForClashes,
  activateBooking,
  fetchBookingsByUser,
  fetchOrdersByOwner,
  postRenterReview,
  postOnwerReview
}
