// 1 - Require the relevant files for the Mongoose database, the Campground model, and the cities & seedHelpers
const mongoose = require('mongoose');
const cities = require('./cities'); // import cities array
const { places, descriptors } = require('./seedHelpers') // import and destructed helper arrays
const Campground = require('../models/campground')
const axios = require('axios');

// 2 - Code to connect to the database
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// 3 - Create the code to actually seed the database

// Function: pick a random element from an array
//      Input: an array
//      Output: a random element from the array
const sample = array => array[Math.floor(Math.random() * array.length)];

// call unsplash and return small image
async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'NgGVOcrqciC4WcsMf4ZdJ69Fqx89NZGcL97NalfaTMY',
                collections: 1114848,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

// Function: Seed the database with random campgrounds
const seedDB = async () => {
    // Start by deleting everything
    await Campground.deleteMany({});

    // for-loop that makes 50 random campgrounds
    for (let i = 0; i < 40; i++) {
        // random integer to pick a city
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        // create an instance of Campground
        const camp = new Campground({
            image: await seedImg(),
            // location structure: "City, State", e.g. "Arlington, Texas"
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // title structure: "Descriptor Place", e.g. "Grizzly Canyon"
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
            price: price

        })
        // save the instance to the database
        await camp.save()
    }
}

// 4 - Execute the seeding function, then close the database
// seedDB() returns a Promise because it is an async function
seedDB().then(() => {
    mongoose.connection.close();
})