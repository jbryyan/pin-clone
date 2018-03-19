const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = function(req, res){
  User.findOne({
    username: req.body.username
    }, function(err, user){
    if (err) throw err;

    //Send user back to login if no user found
    if (!user) {
      res.status(401).json({ error: 'Username or password incorrect' });
    } else {
      // Check that the passwords match
      user.comparePassword(req.body.password, function(err, isMatch){
        console.log(isMatch);
        if (isMatch && !err) {
          //Create token
          let token = jwt.sign(
            JSON.parse(JSON.stringify(user)), 
            process.env.SECRET, 
            { expiresIn: '1h' }
          );
          res.status(200).json({ token: 'Bearer ' + token, username: req.body.username});
        } else {
          res.status(401).json({ error: 'Username or password incorrect' });
        }
      });
    }
  });
};