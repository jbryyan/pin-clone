const Image = require('../models/images');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const expressJwt = require('express-jwt');

module.exports = function(req, res, next){
  //User is authenticated, proceed to add image to stored image
  const id = mongoose.Types.ObjectId();
  const username = req.tokenPayload.username;
  const dataToSave = req.body.pin;
  const dataId = mongoose.Types.ObjectId(dataToSave._id);
  
  console.log('Before image find')
  // Let's check to see if the user already saved the pin, if he did do nothing.
  // Else, save the pin to his list of pins
  Image.find(
    { username: username }, 
    { userImages: 
      {$elemMatch: 
        { _id: dataId }
      }
    }, function(err, doc){
      if (err) {
        throw err;
      }
      // User has not saved the pin, add it
      if (doc[0].userImages.length === 0){
        Image.findOneAndUpdate(
          { username: username },
          { $push: { 
              userImages: { _id: dataId, url: dataToSave.url, user: dataToSave.user }
            }
          },
          function(err, doc){
            if (err) throw err;
            res.status(200).json({ success: true });
          }
        ); 
      }
      else{
        res.status(204).json({ success: false });
      }
    }
  )
};
