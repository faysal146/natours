const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../Models/TourModel/TourModel');

const DB =
    'mongodb+srv://faysal146:to4I76jeXJmA8cOv@natours-w3d7q.mongodb.net/natours?retryWrites=true&w=majority';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const data = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));

Tour.insertMany([...data])
    .then(dt => console.log(dt))
    .catch(err => console.log(err));
