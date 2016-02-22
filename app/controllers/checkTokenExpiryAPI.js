var express = require('express'),
  router    = express.Router(),
  jwt          = require('jsonwebtoken'),
  mongoose     = require('mongoose');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/checkExpiry', function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'gregsmartdoctorapp', function(err, decoded) {
      if (err) {
        return res.send({
          code: 400 ,
          content : 'Bad Request',
          msg: 'Token is bad or either expired'
        });
      } else {
        var myDate = new Date(decoded.__timeStamp);
        // myDate.setMinutes(myDate.getMinutes());
        var secondsDiff = new Date().getTime() - myDate.getTime();
        var Seconds_from_T1_to_T2 = secondsDiff / 1000;
        var Minutes_Between_Dates = Math.floor(Seconds_from_T1_to_T2)/60;

        if (Minutes_Between_Dates >= 0 && Minutes_Between_Dates <= 180) {
          res.send({
            code: 200 ,
            content : 'OK',
            msg: 'Token is not expired'
          });
        }
        else{
          res.send({
            code: 400 ,
            content : 'Bad Request',
            msg: 'Token is Expired'
          });
        }
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.send({
      code: 403 ,
      content : 'Bad Request',
      msg: 'No token provided'
    });
  }
});
