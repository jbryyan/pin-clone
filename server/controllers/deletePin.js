const Image = require('../models/images');
const mongoose = require('mongoose');

module.exports = function(req, res, next){
    const id = mongoose.Types.ObjectId(req.body.id);
    Image.findOneAndUpdate(
      { username: req.tokenPayload.username },
      { $pull: { 
          userImages: { _id: id }
        }
      }, { new: true },
      function(err, doc){
        if (err) throw err;
        res.status(200).json(doc.userImages);
      }
    ); 
  
};
