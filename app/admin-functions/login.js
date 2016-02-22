var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken');

exports.getLoginDetails = function (username,password) {

  var _pinEmail = username,
    _pinCode = password;

  if (_pinEmail && _pinCode) {
    Registration.find({emailAddress: _pinEmail, pinCode: _pinCode, role: "Admin"}, function (err, user) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server Error',
          msg: 'API not called properly'
        });
      }
      else if (user != null) {
        if (user[0]._doc.isVerified == true) {
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
            var response = {
              code: 200,
              content: 'OK',
              msg: 'Authentication Successful',
              token: token
            };
              res.send(response);
            return response;
          });
        }
        else {
          res.send({
            code: 400,
            content: 'Bad Request',
            msg: 'User not verified'
          });
        }
      }
      else {
        res.send({
          code: 404,
          content: 'Not Found',
          msg: 'Email Address or PIN not correct'
        });
      }
    })
  }
  else {
    res.send({
      code: 404,
      content: 'Not Found',
      msg: 'Missing Credentials'
    });
  }
};
