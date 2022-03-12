// Global Imports
const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

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
/* const server = app.listen(process.env.PORT || 5000, process.env.ADDRESS || 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Web server running on http://${address}:${port}`);
}); */
