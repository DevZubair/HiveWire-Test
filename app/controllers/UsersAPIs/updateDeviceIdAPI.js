var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  DeviceIdSchema = mongoose.model('DeviceIdSchema'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/updateDeviceId', function (req, res, next) {

  var _emailAddress = req.body.emailAddress,
    _deviceID = req.body.deviceID;
  if(_emailAddress && _deviceID)
  {

    AesEncryptDecrypt.encrypt(_emailAddress,function(userEmail){
      var _encryptEmailAddress  = userEmail.content;

      DeviceIdSchema.update({"emailAddress": _encryptEmailAddress},
        {
          "deviceID" : _deviceID

        }, function (error, response) {
          if(error){
            res.send({
              code: 404,
              content: 'Not found',
              msg: 'Email address is found',
              token : req.___new__token
            });
          }
          else{
            res.send({
              code: 200,
              content: 'OK',
              msg: 'device ID is updated',
              token : req.___new__token
            });
          }
        }
      );
    })
  }
  else{
    res.send({
      code : 404 ,
      content : 'Not Found',
      msg : 'Missing Credentials',
      token : req.___new__token
    });
  }
});
