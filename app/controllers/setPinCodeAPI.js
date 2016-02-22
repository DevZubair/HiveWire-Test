var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/setPin', function (req, res, next) {

  var _pinEmail = req.body.emailAddress,
    _pinCode = req.body.pinCode;

  if(_pinEmail && _pinCode) {
    Registration.findOne({emailAddress: _pinEmail}, function (err, user) {

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
      //  if(user._doc.isVerified==true){
          // create a token
          var token = jwt.sign(user, "gregsmartdoctorapp",{
            expiresInMinutes: 180 // expires in 3 hours
          });

          Registration.update({"emailAddress": _pinEmail}, {

            "pinCode": _pinCode,
            "sessionToken": token

          }, function () {
            res.send({
              code: 200,
              content : 'OK',
              msg: 'Pin Code is saved',
              token: token
            });
          });
      //  }
       /* else{
          res.send({
            code: 404,
            content : 'Not Found',
            msg: 'Email Address is not verified'
          });
        }*/
      }
      else {
        res.send({
          code: 404,
          content : 'Not Found',
          msg: 'Email Address not found'
        });
      }
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
