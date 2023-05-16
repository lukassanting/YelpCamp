// ------------------ GLOBAL VARIABLES -----------------

// Require the imports that we installed
const mongoose = require('mongoose');
const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');

// Set Express import to a variable name
const app = express();
// Set a port variable
const port = 3000;


// ------------------ DATABASE LOGIC -----------------

// Require the Campgrounds Model (needs to be made first)
const Campground = require('./models/campground');  // get the campground Mongo model, using Mongoose
const res = require('express/lib/response');

// Hard code in the Mongoose connect url for the database
// Will eventually have some logic here
mongoose.connect('mongodb://localhost:27017/yelp-camp')

// Set up the logic to check if there is an error with the Mongoose database connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// ------------------ EXPRESS LOGIC: SETUP -----------------

// Required for submitting the EDIT, DELETE, etc faking a PUT as POST 
const methodOverride = require('method-override');  // allows for using PUT method as a PATCH method for edit.ejs 

// Tell express to use the ejs-mate package as the ejs engine
app.engine('ejs', ejsMate);

// Set up a views directory and connect with ejs - make sure to make a basic home.ejs "HTML" file to test
//      Set the views engine first
app.set('view engine', 'ejs');
//      Set the views directory
app.set('views', path.join(__dirname, 'views'))

// Required for making Express post the body
app.use(express.urlencoded({ extended: true }))

// Required for submitting the EDIT, DELETE, etc, faking a PUT as POST 
app.use(methodOverride('_method')) // with the string we want to use for our query string


// ---------------- EXPRESS LOGIC: ROUTES -----------------
// (requires making the .ejs files)

// Set up the first app.get() for the home page (from views directory)
app.get('/', (req, res) => {
    res.render('home')
})

// CRUD functionality for the campgrounds
// Route for rendering the index page
app.get('/campgrounds', async (req, res) => {
    // This means we have to get the Campground information from the Mongoose database
    const campgrounds = await Campground.find({});
    // Pass it through to our template. Note that it is structured in different folders (set up the views folder for this)
    res.render('campgrounds/index', { campgrounds });
})

// The CREATE functionality (needs a NEW (get) and a CREATE (post) route)
//      Render the NEW route (a GET request)
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

//      POST the request body to the Database
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// The SHOW route
//      Remember that order matters here! You can't have anything like '/campgrounds/new' after this as it will treat the 'new' as ':id'
app.get('/campgrounds/:id', async (req, res) => {
    // requires an id, so we can find the campground by id, then rendering the page for this campground
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
})

// The EDIT route
app.get('/campgrounds/:id/edit', async (req, res) => {
    // First find the campground by the ID (same as for SHOW page)
    const campground = await Campground.findById(req.params.id)
    // Send this to (and render) the page for editing
    res.render('campgrounds/edit', { campground });
})

// The PUT (POST) route for actually updating the information
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params // destructured id
    // find by the ID, then the query for UPDATE - with the Spread operator
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})

// The DELETE route
// Eventually this will be restricted so that only the OWNER of the campground can delete it
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


// ------------------ EXPRESS LOGIC: LISTENING -----------------

// Listen on a port, set a console.log() to output
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
