const Car = require('../models/Car');
const CarBuilder = require('../utils/builder/CarBuilder');
const User = require('../models/User');

// Function to list a car for rent
const listCarForRent = async (req, res) => {
    try {
      // Destructure request body
      const { make, model, year, mileage, rentalPricing, pickUpLocation, owner, startDate, endDate } = req.body;
      
      // Build the car object
      const car = new CarBuilder()
        .setMake(make)
        .setModel(model)
        .setYear(year)
        .setMileage(mileage)
        .setRentalPricing(rentalPricing)
        .setPickUpLocation(pickUpLocation)
        .setOwner(owner)
        .addAvailability(startDate, endDate)
        .build();
      
      // Save the car object
      await car.save();

      // Check if owner user exists and set isCarOwner to true
      const ownerUser = await User.findById(owner);
      if (ownerUser) {
        ownerUser.isCarOwner = true;
        await ownerUser.save();
      }
      
      // Return success message and car object
      return res.status(201).json({
        message: "Car listed for rent successfully!",
        car
      });
    } catch (error) {
      console.error('Error listing the car for rent: ', error);
      return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to list user's car listings
const listUserCarListings = async (req, res) => {
    try {
        // Get the user ID from request parameters
        const userId = req.params.userId;
        // Find car listings by owner ID
        const userCarListings = await Car.find({ owner: userId });

        // Return user's car listings
        return res.status(200).json(userCarListings);
    } catch (error) {
        console.error('Error fetching user car listings:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to update car listing
const updateCarListing = async (req, res) => {
    try {
      // Get car ID from request parameters
      const { carId } = req.params;
      // Get updated car data from request body
      const updatedCarData = req.body;
      
      // Find and update the car listing
      const updatedCar = await Car.findByIdAndUpdate(carId, updatedCarData, { new: true });
      
      // Return updated car listing
      return res.status(200).json(updatedCar);
    } catch (error) {
      console.error('Error updating car listing:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to delete car listing
const deleteCarListing = async (req, res) => {
    try {
      // Get car ID from request parameters
      const { carId } = req.params;
      // Find and delete the car listing
      const deletedCar = await Car.findByIdAndDelete(carId);
      if (!deletedCar) {
        return res.status(404).json({ message: "Car not found" });
      }
      // Return success message if car deleted successfully
      return res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
      console.error('Error deleting car:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to fetch all cars
const fetchAllCars = async (req, res) => {
  try {
    // Destructure query parameters
    const { location, fromDate, toDate } = req.query;
    // Get current date
    const currentDate = new Date();
    // Set initial query
    let query = { 'availability.endDate': { $gte: currentDate } };

    // Check if location query parameter exists
    if (location) {
      query.pickUpLocation = location;
    }

    // Check if fromDate and toDate query parameters exist
    if (fromDate && toDate) {
      query['availability.startDate'] = { $lte: new Date(fromDate) };
      query.$or[0]['availability.endDate'] = { $gte: new Date(toDate) };
    }

    // Find and return cars based on query
    const cars = await Car.find(query);
    return res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching all cars: ', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to fetch a single car
const fetchSingleCar = async (req, res) => {
  try {
    // Get car ID from request parameters
    const carId = req.params.id;
    // Find car by ID
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    // Return car object
    return res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching single car: ', error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
    listCarForRent,
    fetchAllCars,
    fetchSingleCar,
    listUserCarListings,
    updateCarListing,
    deleteCarListing
};
