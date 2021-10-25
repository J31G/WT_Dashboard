const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const usersDB = require('../../models/users');

const initialise = (getUserByEmail, getUserById) => {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (!user) return done(null, false, { message: 'No user with that email' });

    try {
      if (!await bcrypt.compare(password, user.password)) return done(null, false, { message: 'Password incorrect' });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, getUserById(id)));
};

module.exports.initialisePassport = async () => {
  const users = await usersDB.find({});

  initialise(
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id),
  );
};
