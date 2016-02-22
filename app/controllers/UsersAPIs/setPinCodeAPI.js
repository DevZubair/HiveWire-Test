var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/setPin', function (req, res, next) {

  var _pinEmail = req.body.emailAddress,
    _pinCode = req.body.pinCode;

  if(_pinEmail && _pinCode) {

     AesEncryptDecrypt.encrypt(_pinCode,function(encryptData){
     var _encryptPinCode  = encryptData.content;
     AesEncryptDecrypt.encrypt(_pinEmail,function(encryptData){
     var _encryptEmailAddress  = encryptData.content;

    Registration.findOne({emailAddress: _encryptEmailAddress }, function (err, user) {

      if (err) {
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly'
        });
      }
      else if (user) {
        delete user._doc.sessionToken;
        user._doc.__timeStamp = new Date();

        var token = jwt.sign(user, "gregsmartdoctorapp",{
          expiresInMinutes: 180 // expires in 3 hours
        });

        Registration.update({"emailAddress": _encryptEmailAddress}, {

          "pinCode": _encryptPinCode,
          "sessionToken": token

        }, function () {
          res.send({
            code: 200,
            content : 'OK',
            msg: 'Pin Code is saved',
            token: token
          });
        });
      }
      else {
        res.send({
          code: 404,
          content : 'Not Found',
          msg: 'Email Address not found'
        });
      }
    });
  })
});
  }
  else{
    res.send({
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
