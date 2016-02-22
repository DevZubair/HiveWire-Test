var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/retrieveOtherContacts', function (req, res, next) {

  var  _emailAddress = req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailAddress'];

  Registration.find({$and: [{emailAddress: {$ne: _emailAddress}}, {otherEmail: true}]}, function (err, users) {
    if (err) {
      res.send({
        code: 500,
        content: 'Internal Server Error',
        msg: 'API not called properly',
        token: req.___new__token
      });
    }
    else {
      if(users.length > 0) {

        for (var i = 0; i < users.length; i++) {
          AesEncryptDecrypt.decrypt(users[i].emailAddress, function (userEmail) {
            users[i].emailAddress = userEmail;
            if (i == users.length - 1) {
              res.send({
                code: 200,
                content: users,
                msg: 'Other Users retrieved successfully',
                token: req.___new__token
              });
            }
          })
        }
      }
      else{
        res.send({
          code: 200,
          content: users,
          msg: 'Other Users retrieved successfully',
          token: req.___new__token
        });
      }
    }
  })
});
