const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

exports.getLogin = (req, res, next) => {
  res.status(200).json({});
};

exports.getSignup = (req, res, next) => {
  res.status(200).json({});
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            const jwtToken = jwt.sign(
              { userId: user._id, email: user.email },
              'cryptosecerts',
              { expiresIn: '1h' }
            );
            return res.status(200).json({
              message: 'Login successful',
              token: jwtToken,
              userId: user._id,
            });
          }
          res.status(401).json({
            message: 'Invalid email or password',
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            message: 'An error occurred during login',
            error: err.message,
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Server error',
        error: err.message,
      });
    });
};

exports.postLogout = (req, res, next) => {
  res.status(200).json({
    message: 'Logout successful ',
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.status(409).json({
          message: 'Email already exists',
        });
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
          });
          return user.save();
        })
        .then(result => {
          res.status(201).json({
            message: 'User signed up successfully',
            userId: result._id,
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Signup failed',
        error: err.message,
      });
    });
};
