// Global Imports
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();

// Local Imports
const rootRoute = require('./routes/root');
const eventsRoute = require('./routes/events');
const errorRoute = require('./routes/error');
const usersDB = require('./models/users');
const { initExpress } = require('./modules/init/express');
const { initialise: initialisePassport } = require('./modules/init/passport');

// DB connect
mongoose.connect(process.env.MONGO_URI).catch((err) => console.error(err));

// Get out users list from DB and init passport
(async () => {
  const users = await usersDB.find({});

  initialisePassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id),
  );
})();

// Express Setup
const app = express();
initExpress(app);

// Express Routes
app.use('/', rootRoute);
app.use('/events', eventsRoute);
app.use('*', errorRoute);

// HTTP address/port for our web app
const server = app.listen(process.env.PORT || 5000, process.env.ADDRESS || 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Web server running on http://${address}:${port}`);
});
