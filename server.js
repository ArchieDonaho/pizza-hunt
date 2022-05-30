const express = require('express');
const mongoose = require('mongoose'); //import mongoose

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

// tell mongoose which database we want to connect to
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-hunt', // MONGODB_URI will exists with heroku
  {
    useNewUrlParser: true, // turn on the option to use the new connection string parser
    useUnifiedTopology: true, // removes support for several connection options that are no longer relevant w/ the new topology engine
  }
);

// use this to log mongo queries being executed
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
