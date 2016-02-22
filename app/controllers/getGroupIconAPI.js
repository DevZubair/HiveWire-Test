var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getGroupIcon', function (req, res, next) {
  var _request = req.body,
    imageRootPath = 'images/group_icon/',
    options = {
      root: ".",
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

  res.sendFile(imageRootPath + _request.imageName+".jpg", options, function (err) {
    if (err) {
      res.send({
        code: 500,
        content : 'Internal Server Error',
        msg: 'API not called properly',
        token:  req.___new__token
      });
    }
    else {
      res.send({
        code: 200,
        content : 'OK',
        msg: 'Group icon updated',
        token: req.___new__token

      });
    }
  });
});
