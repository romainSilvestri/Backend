const express = require('express');
const passport = require('passport');
const { MovieModel, UserModel } = require('../database/database');


const router = express.Router();

const authenticationRequired = () => passport.authenticate('jwt', { session: false });

router.get('/movies', (req, res) => {
  MovieModel.find({})
    .then((item) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(item));
    })
    .catch((err) => {
      res.send(err);
    });
});


// This endpoint is protected and has access to the authenticated user.
router.get('/watchlist', authenticationRequired, (req, res) => {
  UserModel.find({ username: req.user.username }).then((data) => {
    const promises = [];
    data.watchlist.forEach((element) => {
      promises.push(MovieModel.find({ _id: element }, { password: 0 }));
    });
    Promise.all(promises).then((result) => {
      res.status(200).send(result);
    })
      .catch((err) => {
        res.status(400).send(err);
      });
  })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post('/watchlist', authenticationRequired, (req, res) => {
  const { movieId } = req;
  UserModel.findOneAndUpdate({ username: req.body.username }, movieId)
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
