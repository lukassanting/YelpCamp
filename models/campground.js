// Require the installed package
const mongoose = require('mongoose');

// Make a variable for the mongoose.Schema just to shorten the code for this
const Schema = mongoose.Schema;

// Make the schema, with some basic stuff
// Will eventually also have owner/author, reviews, ...
const CampgroundSchema = new Schema({
    title: String,
    location: String,
    image: String,
    price: Number, // can maybe be changed to a number
    description: String
})

// Export the model: The compiled schema
module.exports = mongoose.model('Campground', CampgroundSchema)