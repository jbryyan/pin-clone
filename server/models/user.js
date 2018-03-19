const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Image = require('./images');

// User schema
const CombinedSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        minlength: [3, 'Username must me at least 3 characters long.']
    },
    twitter: {
      uid: String,
      image: String,
    },
    local: {
      username: String,
      password: String,
      image: String,
    }
    
}, {collection: 'user' });


// Save the users hashed pwd.
CombinedSchema.pre('save', function(next){
  let user = this;
  if(!user.twitter.uid){
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt){
            if (err) return next(err);

            bcrypt.hash(user.local.password, salt, function(err, hash){
                if (err) return next(err);
                user.local.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
  } else return next()
    
});

// Method to compare password with pwd in db.
CombinedSchema.methods.comparePassword = function(pw, cb){
    bcrypt.compare(pw, this.local.password, function(err, isMatch){
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
}

// Add new user with twitter credentials to db.
CombinedSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, done){
  var that = this;

  // Check db to see if twitter user already authenticated the app
  return this.findOne({
    'twitter.uid': profile.id
  }, function(err, user){
    if(err) throw err;

    // If twitter user already authenticated app, return user profile
    // else, add new user to the db with twitter credentials
    if(!user){
      var newUser = new that({
        username: profile.username,
        twitter: {
          uid: profile.id,
          image: profile.photos[0].value
        }
      });
      // If user was not found in db, also make new collections for the user images
      let newImage = new Image({ username: profile.username });
      newImage.save();
      // Save new user
      newUser.save(function(error, savedUser){
        if(error) throw error;
        return done(error, savedUser);
      });
    } else {
      return done(err, user);
    }
  });
}

module.exports = mongoose.model('Combined', CombinedSchema);