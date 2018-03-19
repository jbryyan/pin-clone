const TwitterTokenStrategy = require('passport-twitter-token');
const User = require('../models/user');

module.exports = function(passport){

  passport.use(new TwitterTokenStrategy({
    consumerKey: process.env.CONSUMERKEY,
    consumerSecret: process.env.CONSUMERSECRET,
  }, 
  function(token, tokenSecret, profile, done){
    User.upsertTwitterUser(token, tokenSecret, profile, function(err, user){
      return done(err, user);
    });
  }));

 
}