const Items = require('../Models/menuItem');

exports.getMenuItemsByRestaurant = (req, res) => {
    const { resId } = req.params;
    Items.find({ restaurantId: resId })
        .then(response => {
            res.status(200).json({ message: "Menu Items Fetched Succesfully", items: response })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}