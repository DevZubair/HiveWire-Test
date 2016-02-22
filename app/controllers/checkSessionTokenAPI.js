var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken');

module.exports = function (app) {
  app.use('/', router);
};

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token       = req.body.token || req.query.token || req.headers['x-access-token'],

    _emailAddress = req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailAddress'];

  // decode token
  if (token && _emailAddress) {
    Registration.findOne({emailAddress : _emailAddress , sessionToken:token}, function (err,user) {
      if(err){
        res.send({
          code: 404,
          content : 'Not Found',
          msg: 'Missing token or email address'
        });
      }
      else if(user!=null){
        jwt.verify(token, "gregsmartdoctorapp", function(err, decoded) {
          if (err) {
            return res.send({
              code: 400 ,
              content : 'Bad Request',
              msg: 'Token is Expired'
            });
          } else {
            var myDate = new Date(decoded.__timeStamp);
            // myDate.setMinutes(myDate.getMinutes());
            var secondsDiff = new Date().getTime() - myDate.getTime();
            var Seconds_from_T1_to_T2 = secondsDiff / 1000;
            var Minutes_Between_Dates = Math.floor(Seconds_from_T1_to_T2)/60;

            if (Minutes_Between_Dates >= 0 && Minutes_Between_Dates <= 170) {
              req.___new__token = token;
              next();
            }
            else if(Minutes_Between_Dates >= 180){
                res.send({
                code: 400 ,
                content : 'Bad Request',
                msg: 'Token is Expired'
              });
            }
            else {
              // issue a new token
              delete user._doc.sessionToken;
              user._doc.__timeStamp = new Date();
              var refreshed_token = jwt.sign(user, "gregsmartdoctorapp", {expiresInMinutes: 180});
              req.___new__token = refreshed_token;
              Registration.update({"emailAddress": _emailAddress}, {

                "sessionToken": refreshed_token

              }, function () {
                next();
              });
            }
          }
        });
      }
      else{
        res.send({
          code: 400 ,
          content : 'Bad Request',
          msg: 'Email and token mismatch'
        });
      }
    });
  }
  else {
    // if there is no token
    // return an error
    res.send({
      code: 404,
      content : 'Not Found',
      msg: 'Missing token or email address'
    });
  }
});
