var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getProfileImage', function (req, res, next) {
  var _request = req.body,
    imageRootPath = 'images/profile_pic/',
    options = {
      root: ".",
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

  res.sendFile(imageRootPath + _request.imageName, options, function (err) {
    if (err) {
      console.log(err);
      res.send({
        code: 500,
        content: 'Internal Server Error',
        msg: 'API not called properly',
        token:  req.___new__token
      });
    }
    else {
      console.log('Sent:', _request.imageName);
    }
  });
});
