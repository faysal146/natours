const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');

dotenv.config();
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
  .then(con => {
    console.log(con);
  });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server is running.....');
});
