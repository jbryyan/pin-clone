const Image = require('../models/images');
const mongoose = require('mongoose');

module.exports = function(req, res, next){
  //User is authenticated, proceed to add image to stored image
  const imageUrl = req.body.image;
  const id = mongoose.Types.ObjectId();
  const username =  req.tokenPayload.username;
  const query = { _id: id, url: imageUrl, user: username };

  Image.findOneAndUpdate(
    { username: username },
    { $push: { 
        userImages: query
      }
    },
    function(err, doc){
      if (err) throw err;
      res.status(200).json(query);
    }
  );    
};
