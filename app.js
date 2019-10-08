const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routes/TourRoute');
const userRouter = require('./Routes/UserRoute');

const app = express();

app.use(morgan('dev'));
app.use(express.json());


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
