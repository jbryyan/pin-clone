import request from 'request';
import passport from 'passport'

module.exports = function(req, res, next){
  // parsing tokens passed in from user.
  // The tokens are the tokens obtained from the twitter callback after the
  // user authorized our app
  var tokens = req.query.auth.substring(1);
  var jsonStr = '{ "' + tokens.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
  var jsonObj = JSON.parse(jsonStr);

  // The post request will verify the user, once verified we will 
  // make add a new user to db or we will obtain the user info if already in db
  request.post({
    url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
    oauth: {
      consumer_key: process.env.CONSUMERKEY,
      consumer_secret: process.env.CONSUMERSECRET,
      token: jsonObj.oauth_token,
      verifier: jsonObj.oauth_verifier
    }
  }, function (err, r, body) {
    if(err) {
      return res.send(500, { message: err.message });
    }
    // If the call failed, return error messages
    if(body === 'This feature is temporarily unavailable'){
      return res.send(500, { message: body });
    } else if (body === 'Invaid request token.'){
      return res.send(500, { message: body });
    }

    // If the call was successful, appropriate token will be returned
    // This token can be used to make twitter calls if the programmer wants to
    // In our case, we will not make any calls. We solely want to verify the user is who they say they are
    // But the option to add the functionality is there
    const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    const jsonObj = JSON.parse(jsonStr);
    req.body['oauth_token'] = jsonObj.oauth_token;
    req.body['oauth_token_secret'] = jsonObj.oauth_token_secret;
    req.body['user_id'] = jsonObj.user_id;
  
    next();
  });
}, passport.authenticate('twitter-token', {session: false}), function(req, res, next){
  // Before this, we use the twitter-token strategy implemented in our config 
  if(!req.user) return res.send(401, 'User not authenticated');

  // Prepare token for API
  req.auth = { 
    username: req.user.username,
    image: req.user.twitter.image
  };

  // Proceed to return our signed jwt token
  return next();
};