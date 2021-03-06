require('dotenv/config');

const express = require('express');
const passport = require('passport');
const cors = require('cors');
const { port } = require('./config');
const api = require('./routes/api');
const { router } = require('./routes/auth');

const app = express();

app.use(cors());

// middleware to enable json data
app.use(express.json());
app.use(passport.initialize());

app.use('/', api);

app.use('/auth', router);

// middleware to handle erros
app.use((err, req, res) => {
  res.status(400).send(err);
});

app.listen(port, () => {});
