var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/login', function (req, res, next) {

  var _pinEmail = req.body.emailAddress,
    _pinCode = req.body.pinCode;

  if(_pinEmail && _pinCode) {
    Registration.find({emailAddress: _pinEmail, pinCode: _pinCode}, function (err, user) {
      if (err) {
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly'
        });
      }
      else if (user!='') {
        if(user[0]._doc.isVerified == true)
        {
          /*Delete old Token*/
          delete user[0]._doc.sessionToken;
          user[0]._doc.__timeStamp = new Date();
          // create a token
          var token = jwt.sign(user, "gregsmartdoctorapp", {
            expiresInMinutes: 180 // expires in 3 hours
          });
          Registration.update({"emailAddress": _pinEmail}, {

            "sessionToken": token

          }, function () {
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
      else {
        res.send({
          code: 404,
          content : 'Not Found',
          msg: 'Email Address or PIN not correct'
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
