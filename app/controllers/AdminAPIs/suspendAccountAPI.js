var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/suspendAccount', function (req, res, next) {

  var _blockEmail = req.body.blockUserEmail;

  if (_blockEmail) {
    AesEncryptDecrypt.encrypt(_blockEmail,function(userEmail) {
      var _encryptEmailAddress = userEmail.content;

      mongoose.model('Registration').update({emailAddress: _encryptEmailAddress}, {

        "block": true

      }, function (err, Room) {
        if (err) {
          res.send({
            code: 500,
            content: 'Internal Server error',
            msg: 'API error',
            token: req.___new__token
          });
        }
        else if (Room.n == 1) {

          res.send({
            code: 200,
            content: 'OK',
            msg: 'User blocked',
            token: req.___new__token
          });
        }
        else {
          res.send({
            code: 404,
            content: 'Not Found',
            msg: 'User not found',
            token: req.___new__token
          });
        }
      });
    })
  }
  else {
    res.send({
      code: 404,
      content: 'Not Found',
      msg: 'Missing Credentials',
      token:  req.___new__token
    });
  }
});
