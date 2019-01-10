require('dotenv').config();

const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line no-unused-vars, should be used but problem, see further
const { jwtOptions } = require('../config');
const { UserModel } = require('../database/database');

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

// find and authenticate a user with a username and a password
passport.use(new LocalStrategy(
  // Options
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  // Verification function
  (username, password, done) => {
    UserModel.findOne({ username, password }, { password: 0 }, (err, obj) => {
      if (err || !obj) {
        return done(null, false);
      }
      return done(null, obj);
    });
  },
));

// find and authenticate a user with a jwt token
passport.use(new JWTStrategy(
  // Options
  {
    secretOrKey: 'secret', // It should be: jwtOptions.secret, but it's not working for reasons...
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  // Verification function
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    UserModel.findOne({ _id: userId }, { _id: 1 }).then((USER) => {
      if (userId !== USER.id) {
        // User not found
        return done(null, false);
      }
      // User found
      return done(null, USER);
    });
  },
));

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  // here, user exists => returned value from passport verification function
  const { user } = req;
  const token = jwt.sign({ userId: user.id }, 'secret'); // same jwtOptions.secret
  res.send({ user, token });
});

router.post('/register', (req, res) => {
  const { username, password } = req;
  const newUser = new UserModel({ username, password });

  // Check if the user already exists, if it does, do nothing. Otherwise, create it.
  UserModel.findOne({ username }, { password: 0 })
    .then((data) => {
      if (data === null) {
        newUser.save()
          .then(() => {
            newUser.password = null;
            res.status(201).send('Created');
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(500).send('User already exists');
      }
    });
});

module.exports = { router };
