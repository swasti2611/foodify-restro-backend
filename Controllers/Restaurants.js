const Restro=require('../Models/Restaurants')
const Items=require('../Models/menuItem')
// Function to filter restaurants based on query parameters
const filterRestaurants = async (req, res) => {
  let { mealtype, cuisine, location, lcost, hcost, page, sort } = req.body;
    
  page = page ? page : 1;
     sort = sort ? sort : 1;

    let filterPayload = {};
    const itemsPerPage = 2;

    let startIndex = itemsPerPage * page - itemsPerPage;
    let endIndex = itemsPerPage * page;

    if (mealtype) {
        filterPayload = {
            mealtype_id: mealtype
        }
    }
    if (mealtype && cuisine) {
        filterPayload = {
            mealtype_id: mealtype,
            cuisine_id: { $in: cuisine }
        }
    }
    if (mealtype && hcost && lcost) {
        filterPayload = {
            mealtype_id: mealtype,
            min_price: { $lte: hcost, $gte: lcost }
        }
    }
    if (mealtype && cuisine && lcost && hcost) {
        filterPayload = {
            mealtype_id: mealtype,
            cuisine_id: { $in: cuisine },
            min_price: { $lte: hcost, $gte: lcost }
        }
    }
    if (mealtype && location) {
        filterPayload = {
            mealtype_id: mealtype,
            location_id: location
        }
    }
    if (mealtype && location && cuisine) {
        filterPayload = {
            mealtype_id: mealtype,
            location_id: location,
            cuisine_id: { $in: cuisine },
        }
    }
    if (mealtype && location && lcost && hcost) {
        filterPayload = {
            mealtype_id: mealtype,
            location_id: location,
            min_price: { $lte: hcost, $gte: lcost }
        }
    }
    if (mealtype && location && cuisine && lcost && hcost) {
        filterPayload = {
            mealtype_id: mealtype,
            location_id: location,
            cuisine_id: { $in: cuisine },
            min_price: { $lte: hcost, $gte: lcost }
        }
    }

    Restro.find(filterPayload).sort({ min_price: sort })
        .then(response => {
            // Pagination Logic 
            const filteredResponse = response.slice(startIndex, endIndex);
            res.status(200).json({ message: "Restaurants Fetched Succesfully", restaurants: filteredResponse })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};

// Function to get restaurant details by restaurant ID
const getRestaurantDetailById = async (req, res) => {
  const resId = req.params.resId;

  try {
    const restaurant = await Restro.findById(resId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant retrieved successfully", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve restaurant details", error: err.message });
  }
};

const getRestaurantsByLocation = (req, res) => {
  const { locId } = req.params;
  Restro.find({ location_id: locId })
      .then(response => {
          res.status(200).json({ message: "Restaurants Fetched Succesfully", restaurants: response })
      }).catch(err => {
          res.status(500).json({ error: err })
      })
}

const getRestaurantMenuById=async (req,res)=>{
    const resId = req.params.resId;

    try {
      const item = await Items.find({ _id:resId});
      
      res.status(200).json({ message: "Restaurant retrieved successfully", restaurant });
    } catch (err) {
      res.status(500).json({ message: "Failed to retrieve restaurant details", error: err.message });
    }
}

module.exports = { filterRestaurants,  getRestaurantsByLocation, getRestaurantDetailById ,getRestaurantMenuById};
