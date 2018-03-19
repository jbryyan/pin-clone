const Image = require('../models/images');
const mongoose = require('mongoose');

module.exports = function(req, res){
  Image.find({ username: req.query.user }, function(err, doc) {
  if (err){
    res.status(404).send('User not found');
  }
  doc.length > 0 ? 
    res.status(200).json(doc[0].userImages) : res.status(404).send('User not found');
  });
};
