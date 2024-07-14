const mongoose = require("mongoose");

const restaurantsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city_id: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country_name: {
    type: String,
    required: true
  }
});

 let restaurants = mongoose.model('restaurants', restaurantsSchema);
 module.exports=restaurants