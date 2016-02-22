var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/reinstateAccount', function (req, res, next) {

  var _unblockEmail = req.body.unblockUserEmail;

  if (_unblockEmail) {

    AesEncryptDecrypt.encrypt(_unblockEmail,function(userEmail) {
      var _encryptEmailAddress = userEmail.content;

      mongoose.model('Registration').update({emailAddress : _encryptEmailAddress},{

        "block" : false

      }, function (err, Room) {
        if (err) {
          res.send({
            code: 500,
            content: 'Internal Server error',
            msg: 'API error',
            token:  req.___new__token
          });
        }
        else if (Room.n == 1) {

          res.send({
            code: 200,
            content: 'OK',
            msg: 'User unblocked',
            token:  req.___new__token
          });
        }
        else {
          res.send({
            code: 404,
            content: 'Not Found',
            msg: 'User not found',
            token:  req.___new__token
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
