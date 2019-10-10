const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = require('../app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server is running.....');
});
