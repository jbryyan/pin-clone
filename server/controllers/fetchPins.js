const Image = require('../models/images');
const mongoose = require('mongoose');

module.exports = function(req, res){
  Image.find({}, function(err, doc) {
    if (err) {
      res.status(404).send('User not found');
      console.log(err);
    }
    const allImages = [];
    doc.map(obj => {
      obj.userImages.map(images => {
        allImages.push(images);
      })
    });
    res.status(200).json(allImages);
  });
};
