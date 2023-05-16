The point of the files here is to set up some fake campgrounds with which we can SEED the database, so that we have some that we can use at the start.

That way, when we set up our index and edit express routes we already have some 'campgrounds' to work with.

Start by making the cities.js file. Cole uses and provides this one, he says that he found it online, but it provides examples of about a 1000 cities with details like their name, popualtion, state, etc.

Then make a file called seedHelpers.js which has an array of descriptors and an array of places that can be combined to make a fake campground.

Then make an index.js file, where we have a self contained file (connected to mongoose and uses the model).
We run this file on its own any time that we want to seed the database. (Not that often, probably just at the beginning)

