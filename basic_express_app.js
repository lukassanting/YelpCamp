// 1 -  Require the imports that we installed
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

// 6 - make a models directory and make a campground.js with the Campgrounds Model
// Then require the files we made
const Campground = require('./models/campground');  // get the campground Mongo model, using Mongoose
const res = require('express/lib/response');
const campground = require('./models/campground');

// 10.4.2.1 - required for using submitting the EDIT, DELETE, etc faking a PUT as POST 
const methodOverride = require('method-override');  // allows for using PUT method as a PATCH method for edit.ejs 

// 7 - Hard code in the Mongoose connect url for the database
// Will eventually have some logic here
mongoose.connect('mongodb://localhost:27017/yelp-camp')

// 8 - Set up the logic to check if there is an error with the Mongoose database connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
// 9 - Set up the seeds folder so we can seed the database with some initial campgrouds

// 2 - Set express import to a variable name and set a port variable
const app = express();
const port = 3000;

// 4 - Set up a views directory and connect with ejs - make sure to make a basic home.ejs "HTML" file to test
// 4.1 Set the views engine first
app.set('view engine', 'ejs');
// 4.2 Then set the views directory
app.set('views', path.join(__dirname, 'views'))

// 10.3.2.1 - required for making Express post the body
app.use(express.urlencoded({ extended: true }))

// 10.4.2.2 - required for using submitting the EDIT, DELETE, etc, faking a PUT as POST 
app.use(methodOverride('_method')) // with the string we want to use for our query string

// ~~~~~~~~~~ All of our express routes ~~~~~~~~~~

// 5 - Set up the first app.get() for the home page (from views directory)
app.get('/', (req, res) => {
    res.render('home')
})

// 10 - Set up the CRUD functionality for the campgrounds
// 10.1 - Set up the index (and make the views .ejs file!)
app.get('/campgrounds', async (req, res) => {
    // This means we have to get the Campground information from the Mongoose database
    const campgrounds = await Campground.find({});
    // Pass it through to our template. Note that it is structured in different folders (set up the views folder for this)
    res.render('campgrounds/index', { campgrounds });
})

// 10.3 Set up the CREATE functionality (needs a NEW (get) and a CREATE (post) route)
// 10.3.1 Set up the NEW route (a GET request)  (and make the views .ejs file!)
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// 10.3.2.2 Set up the CREATE route (a POST request)
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// 10.2 - Set up the SHOW route (and make the views .ejs file!)
// Remember that order matters here! You can't have anything like '/campgrounds/new' after this as it will treat the 'new' as ':id'
app.get('/campgrounds/:id', async (req, res) => {
    // requires an id, so we can find the campground by id, then rendering the page for this campground
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
})

// 10.4.1 Now we need to make the EDIT route (and make the views .ejs file!)
app.get('/campgrounds/:id/edit', async (req, res) => {
    // First find the campground by the ID (same as for SHOW page)
    const campground = await Campground.findById(req.params.id)
    // Send this to (and render) the page for editing
    res.render('campgrounds/edit', { campground });
})

// 10.4.2.3 Set up the PUT (POST) route for actually updating the information
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params // destructured id
    // find by the ID, then the query for UPDATE - with the Spread operator
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})

// 10.5 - Set up the DELETE route
// Eventually this will be restricted so that only the OWNER of the campground can delete it
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


// 3 - Listen on a port, set a console.log() to output
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
