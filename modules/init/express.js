// Global Imports
const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
// const session = require('express-session');
const session = require('cookie-session');

// Local Imports
const rootRoute = require('../../routes/root');
const errorRoute = require('../../routes/error');

// Main express app
const app = express();

// Set all our express options
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', './public/pages');
app.use(express.static('./public/assets'));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Express Routes
app.use('/', rootRoute);
app.use('*', errorRoute);

// HTTP address/port for our web app
app.listen(process.env.PORT);
