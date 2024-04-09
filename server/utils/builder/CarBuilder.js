const Car = require('../../models/Car');

// Base class for building cars
class CarBuilderBase {
  constructor() {
    if (this.constructor === CarBuilderBase) {
      throw new Error('Cannot instantiate abstract class');
    }
  }

  // Abstract methods to be implemented by subclasses
  setMake(make) {
    throw new Error('Method setMake must be implemented');
  }

  setModel(model) {
    throw new Error('Method setModel must be implemented');
  }

  setYear(year) {
    throw new Error('Method setYear must be implemented');
  }

  setMileage(mileage) {
    throw new Error('Method setMileage must be implemented');
  }

  setRentalPricing(rentalPricing) {
    throw new Error('Method setRentalPricing must be implemented');
  }

  setPickUpLocation(pickUpLocation) {
    throw new Error('Method setPickUpLocation must be implemented');
  }

  setOwner(owner) {
    throw new Error('Method setOwner must be implemented');
  }

  addAvailability(startDate, endDate) {
    throw new Error('Method addAvailability must be implemented');
  }

  build() {
    throw new Error('Method build must be implemented');
  }
}

// Concrete implementation of CarBuilderBase
class CarBuilder extends CarBuilderBase {
  // Car builder constructor contains the car data
  constructor() {
    super();
    this.carData = {};
  }

  // Set the car's make provided make data
  setMake(make) {
    this.carData.make = make;
    return this;
  }

  // Set the car's model provided model data
  setModel(model) {
    this.carData.model = model;
    return this;
  }

  // Set the car's year provided year data
  setYear(year) {
    this.carData.year = year;
    return this;
  }

  // Set the car's mileage provided mileage data
  setMileage(mileage) {
    this.carData.mileage = mileage;
    return this;
  }

  // Set the car's rental pricing provided rental pricing data
  setRentalPricing(rentalPricing) {
    this.carData.rentalPricing = rentalPricing;
    return this;
  }

  // Set the car's pick up location provided pick up location data
  setPickUpLocation(pickUpLocation) {
    this.carData.pickUpLocation = pickUpLocation;
    return this;
  }

  // Set the car's owner provided owner data
  setOwner(owner) {
    this.carData.owner = owner;
    return this;
  }

  // Set the car's availability provided start and end date
  addAvailability(startDate, endDate) {
    this.carData.availability = { startDate, endDate };
    return this;
  }

  // Build a new car with the constructor containing the set car data
  build() {
    return new Car(this.carData);
  }
}

module.exports = CarBuilder;
