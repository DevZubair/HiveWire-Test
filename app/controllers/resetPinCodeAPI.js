var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Registration = mongoose.model('Registration');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/resetPin', function (req, res, next) {

  var _pinEmail = req.body.emailAddress,
    _oldPinCode = req.body.oldPinCode,
    _newPinCode = req.body.newPinCode;

  if(_pinEmail && _oldPinCode && _newPinCode) {
    Registration.findOne({emailAddress: _pinEmail}, function (err, data) {

      if (err) {
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if (data) {
        if(data.pinCode == _oldPinCode)
        {
          Registration.update({"emailAddress": _pinEmail}, {

            "pinCode": _newPinCode

          }, function () {
            res.send({
              code: 200,
              content : 'OK',
              msg: 'Pin Code is updated',
              token: req.___new__token
            });
          });
        }
        else{
          res.send({
            code: 404,
            content : 'Not Found',
            msg: 'Old Pin Code is incorrect',
            token:  req.___new__token
          });
        }
      }
      else {
        res.send({
          code: 404,
          content : 'Not Found',
          msg: 'Email Address not found',
          token:  req.___new__token
        });
      }
    })
  }
  else{
    res.send({
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials',
      token:  req.___new__token
    });
  }
});
