// server/app.js
const express = require('express');
const request = require('request');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const registerUser = require('./controllers/registerUser');
const loginUser = require('./controllers/loginUser');
const mongoose = require('mongoose');
const passport = require('passport');
const addPin = require('./controllers/addPin');
const fetchPins = require('./controllers/fetchPins');
const fetchUserPins = require('./controllers/fetchUserPins');
const savePins = require('./controllers/savePins');
const deletePin = require('./controllers/deletePin');
const twitterReverse = require('./controllers/twitterReverse');
const twitterVerifier = require('./controllers/twitterVerifier');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

app.use(passport.initialize());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Cors with custom headers. Used to send jwt token
app.use(cors({ origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
  credentials: true,
  exposedHeaders: ['x-auth-token']})
);


// Used to protect routes, unless specified
// If the jwt token passed is not loginUserd an error will be returned
app.use('/api', expressJwt({secret: process.env.SECRET, userProperty: 'tokenPayload'})
  .unless({ path: 
    [
      '/api/fetchPins', '/api/fetchUserPins', 
      '/api/loginUser', '/api/registerUser',
      '/auth/twitter/callback', '/auth/twitter'
    ]
  })
);

//Connect to db using mongoose
mongoose.connect(process.env.URL);

// Bring in passport strategy
require('./config/main')(passport);

//Register user to db.
app.post('/api/registerUser', registerUser);

//Authentice login username/password
app.post('/api/loginUser', loginUser);

//Add new pin 
app.post('/api/addPin', addPin);

//Save new pin from main page
app.post('/api/savePin', savePins);

//Fetch all pins
app.get('/api/fetchPins', fetchPins);

//Fetch user pins
app.get('/api/fetchUserPins', fetchUserPins);

//Delete user pin
app.delete('/api/deletePin', deletePin);

//-------------------------
//passport-twitter-token
var createToken = function(auth) {
  console.log('in createtoken:' , auth);
  return jwt.sign({
    username: auth.username,
    image: auth.image
  }, process.env.SECRET,
  { 
    expiresIn: '1hr' 
  });
};

var generateToken = function(req, res, next){
  console.log('In generate token');
  console.log(req.auth);
  req.token = createToken(req.auth);
  return next();
};

var sendToken = function(req, res) {
  console.log('In send token');
  console.log(req.user);
  const id = req.user.twitter.id;
  const username = req.user.twitter.username;
  const image = req.user.twitter.image;
  res.setHeader('x-auth-token', 'Bearer ' + req.token);
  return res.status(200).json({ user: req.user });
};



app.get('/auth/twitter/reverse', twitterReverse);

app.post('/auth/twitter', twitterVerifier, generateToken, sendToken);


// Authenticate jwt token from user
app.get('/api/auth/me', function(req, res){
  if(!req.tokenPayload.username) return res.status(401).json({ error: 'Not Authorized' });
  res.status(200).json({ user: req.tokenPayload, loggedIn: true });
});

// Return error if not authorized
app.use(function(err, req, res, next){
  return res.status(err.status || 500).send(err); 
})
module.exports = app;
