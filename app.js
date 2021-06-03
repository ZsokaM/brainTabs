require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Successfully connected to the database ${process.env.MONGODB_URI}`))
  .catch(error => {
    console.error(`An error ocurred trying to connect to the database ${process.env.MONGODB_URI}: `, error);
    process.exit(1);
  });

const indexRouter = require('./routes/index.routes');
const authRouter = require('./routes/auth.routes');

const app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
  });

module.exports = app;