require('dotenv').config();

// DB connect
require('mongoose')
  .connect(process.env.MONGO_URI, {
    dbName: 'WolfTeam',
  })
  .catch((err) => console.error(err));

// All Password related bits
require('./modules/init/passport').initialisePassport();

// All express related bits
require('./modules/init/express');

// All Discord related bits
require('./modules/init/discord');
