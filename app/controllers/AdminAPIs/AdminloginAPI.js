var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/adminLogin', function (req, res, next) {

  var _pinEmail = req.body.username,
    _pinCode = req.body.password;

  if (_pinEmail && _pinCode) {
    Registration.find({emailAddress: _pinEmail, pinCode: _pinCode, role: "Admin"}, function (err, user) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server Error',
          msg: 'API not called properly'
        });
      }
      else if (user != '') {

        /*Delete old Token*/
        delete user[0]._doc.sessionToken;
        user[0]._doc.__timeStamp = new Date();
        // create a token
        var token = jwt.sign(user, "gregsmartdoctorapp", {
          expiresInMinutes: 180 // expires in 3 hours
        });
        Registration.update({"emailAddress": _pinEmail}, {
          $set: {
            "sessionToken": token,
            "last_login" : new Date()

          }}, function () {
          var response = {
            code: 200,
            content: 'OK',
            msg: 'Authentication Successful',
            token: token,
            last_login : user[0]._doc.last_login
          };
          res.send(response);
        });
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
});
