const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../Models/TourModel/TourModel');
const Review = require('../../Models/ReviewModel/ReviewModel');
const User = require('../../Models/UserModel/UserModel');

async function deleteItem() {
    try {
        //await Tour.deleteMany({});
        //await Review.deleteMany({});
        await User.deleteMany({});
        console.log('document was deleted now...');
    } catch {
        console.log('some how docmunt is not able delete');
    }
}

async function addItem(Model, data) {
    try {
        await Model.create(data, { validateBeforeSave: false });
        console.log('document was added now...');
    } catch (err) {
        console.log(err);
    }
}

const getData = async path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) reject(new Error('something went wrong'));
            resolve(JSON.parse(data));
        });
    });
};

const DB =
    'mongodb+srv://faysal146:to4I76jeXJmA8cOv@natours-w3d7q.mongodb.net/natours?retryWrites=true&w=majority';

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(async () => {
        // await deleteItem();
        // console.log('document is deleted now...')
        // const tours = await getData(`${__dirname}/tours.json`);
        // const reviews = await getData(`${__dirname}/reviews.json`);
        //const users = await getData(`${__dirname}/users.json`);
        // addItem(Tour, tours);
        // addItem(Review, reviews);
        addItem(User, users);
    })
    .catch(err => console.log(err));
