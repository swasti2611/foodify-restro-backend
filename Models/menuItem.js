const mongoose = require('mongoose');

// Initialising the mongoose Schema
const Schema = mongoose.Schema;

// Registering the City Schema
const ItemsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('items', ItemsSchema, 'items');   // exporting the model