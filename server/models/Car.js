const mongoose = require('mongoose');

const carSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  rentalPricing: { type: Number, required: true },
  pickUpLocation: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  availability: { type: [{ startDate: Date, endDate: Date }], default: [] }
});

// Compile the model using the schema
const Car = mongoose.model('Car', carSchema);

module.exports = Car;
