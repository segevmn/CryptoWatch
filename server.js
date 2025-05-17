const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGODB_URI =
  'mongodb+srv://SegevCrypto:SegevCrypto@cluster0.ilwdzjo.mongodb.net/CryptoRates';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
  next();
});

const authRoutes = require('./routes/auth');
const coinRoutes = require('./routes/coin');
const userRoutes = require('./routes/user');

app.use('/coingecko', coinRoutes);
app.use(userRoutes);
app.use(authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
