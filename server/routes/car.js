// routes to handle the requests related to car listing, car editing, and car fetching
const express = require('express');
const router = express.Router();
const { 
    listCarForRent, 
    listUserCarListings,
    fetchAllCars, 
    fetchSingleCar,
    updateCarListing, 
    deleteCarListing, 
} = require('../controllers/carController');

router.post('/listCarForRent', listCarForRent);
router.get('/listUserCarListings/:userId', listUserCarListings);
router.get('/fetchAllCars', fetchAllCars);

router.get('/:id', fetchSingleCar);
router.put('/:carId', updateCarListing);
router.delete('/:carId', deleteCarListing);

module.exports = router;