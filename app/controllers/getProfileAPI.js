var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getProfile', function (req, res, next) {
  if(req.body.emailAddress) {
    Profiles.findOne({emailAddress: req.body.emailAddress}, function (err, profile) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if (profile != null) {
        res.send({
          code: 200,
          content: profile,
          msg: 'Profile data sent in response',
          token: req.___new__token
        });
      }
      else {
        res.send({
          code: 404,
          content: 'Not Found',
          msg: 'Email Address not found',
          token:  req.___new__token
        });
      }
    });
  }
  else
  {
    res.send({
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials',
      token:  req.___new__token
    });
  }
});
