var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken'),
  joinAdminRoom = require('../AdminAPIs/joinAdminRoomAPI.js'),
  DeviceIdSchema = mongoose.model('DeviceIdSchema'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/login', function (req, res, next) {

  var _pinEmail = req.body.emailAddress,
    _pinCode = req.body.pinCode,
    _deviceID = req.body.deviceID,
    _deviceType = req.body.deviceType;

  if(_pinEmail && _pinCode) {

    AesEncryptDecrypt.encrypt(_pinEmail,function(userEmail){
      var _encryptEmailAddress  = userEmail.content;
      AesEncryptDecrypt.encrypt(_pinCode,function(pinCode){
        var _encryptPinCode  = pinCode.content;

        if(_deviceID && _deviceType){
          DeviceIdSchema.update({"emailAddress": _pinEmail}, {

            "deviceID": _deviceID,
            "deviceType" : _deviceType

          }, function () {

          });
        }

        Registration.find({emailAddress: _encryptEmailAddress, pinCode: _encryptPinCode}, function (err, user) {
          if (err) {
            res.send({
              code: 500,
              content : 'Internal Server Error',
              msg: 'API not called properly'
            });
          }
          else if (user!='') {
            if(user[0]._doc.block == false){

              if(user[0]._doc.isVerified == true)
              {
                /*Delete old Token*/
                delete user[0]._doc.sessionToken;
                user[0]._doc.__timeStamp = new Date();
                // create a token
                var token = jwt.sign(user, "gregsmartdoctorapp", {
                  expiresInMinutes: 180 // expires in 3 hours
                });
                Registration.update({"emailAddress": _encryptEmailAddress}, {

                  "sessionToken": token

                }, function () {
                  joinAdminRoom.joinRoom(_pinEmail);
                  res.send({
                    code: 200,
                    content : 'OK',
                    msg: 'Authentication Successful',
                    token : token
                  });
                });
              }
              else{
                res.send({
                  code: 400,
                  content : 'Bad Request',
                  msg: 'User not verified'
                });
              }
            }
            else{
              res.send({
                code: 400 ,
                content : 'Bad Request',
                msg: 'Your account is blocked, please contact admin'
              });
            }
          }
          else {
            res.send({
              code: 404,
              content : 'Not Found',
              msg: 'Email Address or PIN not correct'
            });
          }
        });
      })
    })
  }
  else{
    res.send({
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
