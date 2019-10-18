const mongoose = require('mongoose');
const dotenv = require('dotenv');
// handle synce error
process.on('uncaughtException', err => {
    // console.log(err.message, err.name);
    console.log(err);
    process.exit(1);
});

dotenv.config();
const app = require('../app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('mongo bd connect...'));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('server is running.....');
});

// if any unhandle promise
process.on('unhandledRejection', err => {
    // console.log(err.message, err.name);
    console.log(err);
    console.log('Unhandled Rejection Shutting Down...');
    server.close(() => process.exit(1));
});
