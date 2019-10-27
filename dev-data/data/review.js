const fs = require('fs');
const mongoose = require('mongoose');
const Review = require('../../Models/ReviewModel/ReviewModel');

const DB =
    'mongodb+srv://faysal146:to4I76jeXJmA8cOv@natours-w3d7q.mongodb.net/natours?retryWrites=true&w=majority';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
const path = './reviews.json';
const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
/*
Tour.deleteMany({})
    .then(() => {
        console.log('all tour are deleted');
        process.exit();
    })
    .catch(() => {
        process.exit();
        console.log('something went wrong...');
    });
*/

Review.insertMany([...data])
    .then(dt => {
        console.log('tour is add');
        process.exit();
    })
    .catch(err => {
        console.log('tour is not add');
        process.exit();
    });
