import request from 'request';

// This function calls for a request token from twitter, will send back to user
// First step in oauth with twitter
module.exports = function(req, res){
  request.post({
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
      oauth_callback: process.env.CALLBACK,
      consumer_key: process.env.CONSUMERKEY,
      consumer_secret: process.env.CONSUMERSECRET
    }
  }, function (err, r, body) {
    if(err) return res.send(500, { message: err.message });
    var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    var jsonObj = JSON.parse(jsonStr);
    var link = 'https://api.twitter.com/oauth/authenticate?';
    res.json(200, { twitterAuth:  link + 'oauth_token=' + jsonObj.oauth_token });
  })
};