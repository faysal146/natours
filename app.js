const fs = require('fs');
const express = require('express');
const app = express();
const RouteHandler = require('./routeHandler');
const { getAllPost, createPost, getTour, upDateTour, deleteTour } = new RouteHandler();
// use middleWere
app.use(express.json());

//all the route
app.route('/api/v1/tours').get(getAllPost).post(createPost);
app.route('/api/v1/tours/:id').get(getTour).patch(upDateTour).delete(deleteTour);

app.listen(3000);
