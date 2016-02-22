var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/getProfileImage', function (req, res, next) {
  var _imageName = req.body.imageName || req.query.imageName || req.headers['x-access-imageName'],
    _emailAddress = req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailAddress'],

    imageRootPath = 'images/profile_pic/'+_emailAddress,
    options = {
      root: ".",
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

  res.sendFile(imageRootPath +'/' + _imageName, options, function (err) {
    if (err) {
      console.log(err);
     /* res.send({
        code: 500,
        content: 'Internal Server Error',
        msg: 'API not called properly'
     //   token:  req.___new__token
      })*/
    }
    else {
      console.log('Sent:', _imageName);
     /* res.send({
        code: 200,
        content: 'OK',
        msg: 'Pic sent successfully'
       // token:  req.___new__token
      });*/
    }
  });
});
