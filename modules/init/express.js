const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

module.exports.initExpress = async (app) => {
  app.set('view engine', 'ejs');
  app.set('views', './public/pages');
  app.use(express.static('./public/assets'));
  app.use(express.urlencoded({ extended: true }));
  app.use(flash());
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.json());
};
