const mongoose = require('mongoose');
const ImageSchema = new mongoose.Schema({
  username: String,
  userImages: { 
    _id: false,
    type: Array, 
    'default': [] 
  }
}, {collection: 'images' });

module.exports = mongoose.model('Image', ImageSchema);