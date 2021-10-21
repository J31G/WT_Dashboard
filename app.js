// Global Imports
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Local Imports
const rootRoute = require('./routes/root');
const eventsRoute = require('./routes/events');
const { initExpress } = require('./modules/init/express');
const { initialise: initialisePassport } = require('./modules/init/passport');

// TEMP: UNTIL DB, STORE USER IN HERE
(async () => {
  const users = [
    {
      id: 123,
      name: 'Jamie',
      email: 'jamie@lambertstock.com',
      password: await bcrypt.hash('Abcd1234', 10),
      userType: 'Super Admin',
    },
  ];
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

// HTTP address/port for our web app
const server = app.listen(process.env.PORT || 5000, process.env.ADDRESS || 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Web server running on http://${address}:${port}`);
});
