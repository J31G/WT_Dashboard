// Global Imports
const mongoose = require('mongoose');
require('dotenv').config();

// DB connect
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'WolfTeam',
}).catch((err) => console.error(err));

// All Passowrd related bits
require('./modules/init/passport').initialisePassport();

// All express related bits
require('./modules/init/express');

// All Discord related bits
require('./modules/init/discord');
