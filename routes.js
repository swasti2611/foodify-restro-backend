const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
require('dotenv').config();

const getMealtypesController = require('./Controllers/Mealtype');
const getLocationController = require('./Controllers/Location');
const { filterRestaurants, getRestaurantsByLocation, getRestaurantDetailById } = require('./Controllers/Restaurants');
const menuController = require('./Controllers/menuItem');

// Define your API endpoints
router.get('/api/locations', getLocationController);
router.get('/api/mealtypes', getMealtypesController);
router.get('/api/restaurantByLocation/:locId', getRestaurantsByLocation);
router.get('/api/restaurantById/:resId', getRestaurantDetailById);
router.get('/api/menuitems/:resId', menuController.getMenuItemsByRestaurant);
router.post('/api/filter', filterRestaurants);

// Payment endpoint
router.post("/api/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");

    }
    
    res.json(order);
    
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
module.exports = router;
