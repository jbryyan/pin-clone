const User = require('../models/user');
const Image = require('../models/images');
const jwt = require('jsonwebtoken');


module.exports = function(req, res){
  if(!req.body.username || !req.body.password) {
    res.json({ success: false, message: 'Please enter a username and password to register.' });
  } else {
    var newUser = new User({
      username: req.body.username,
      local: {
        username: req.body.username,
        password: req.body.password,
      }
    });
    // Attempt to save new user
    newUser.save((err) => {
        if (err && err.code === 11000) 
          return res.status(500).json({ error: { username: 'Username must be unique' }});
        else if (err) 
          return res.status(500).json({ error: err.errors.username.message });
        else{ 
          let newImage = new Image({ username: req.body.username });
          newImage.save();

          jwt.sign(JSON.parse(JSON.stringify(newUser)), 
            process.env.SECRET, 
            { expiresIn: '1h' },
            function(err,token){
                if (err) throw err;
                console.log('successful');
                res.json({ token: 'Bearer ' + token, username: req.body.username });
            }
          );
        }
    });
  }
};
