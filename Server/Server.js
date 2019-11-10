const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');
// handle synce error
process.on('uncaughtException', err => {
    // console.log(err.message, err.name);
    console.log(chalk.bgRed('error'), err);
    process.exit(1);
});
// config dot env file
dotenv.config();

const app = require('../app');

// replacing the mongoDB connection string with Data base Password
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// connect the server to the mongoDB data base
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log(chalk.bgHex('#fff').hex('#000')('mongoDB is now connected...')))
    .catch(() => {
        console.log(chalk.italic.bgRed('some how mongoDB is not able to connect...'));
        process.exit();
    });

const PORT = process.env.PORT || 3000;

// start the server
const server = app.listen(PORT, () => {
    console.log(chalk.greenBright('server is running.....'));
});

// if any unhandle promise
process.on('unhandledRejection', err => {
    // console.log(err.message, err.name);
    console.log(chalk.bgRed('error'), err.message);
    console.log(chalk.red('Unhandled Rejection Shutting Down...'));
    server.close(() => process.exit(1));
});
