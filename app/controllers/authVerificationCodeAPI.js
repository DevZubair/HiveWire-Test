var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Registration = mongoose.model('Registration');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/verifyCode', function (req, res, next) {

  var _verificationEmail = req.body.emailAddress,
    _verificationCode = req.body.verificationCode;

  if(_verificationEmail && _verificationCode)
  {
    Registration.findOne({emailAddress:_verificationEmail},function(err,data) {

      if(err){
        res.send({
          code : 500,
          content : 'Internal Server Error',
          msg : 'API not called properly'
        });
      }
      else if(data){

        if(_verificationCode == data.verificationCode){         // will use later && data.isVerified == false
          Registration.update({"emailAddress":_verificationEmail},{

            "isVerified" : true

          },function(){
            res.send({
              code : 200,
              content : 'OK',
              msg : 'Verified'
            });
          });
        }
        else{
          res.send({
            code : 404 ,
            content : 'Not Found',
            msg : 'Wrong code, not Verified'
          });
        }
      }
      else{
        res.send({
          code : 404 ,
          content : 'Not Found',
          msg : 'Email Address not found'
        });
      }
    });
  }
  else{
    res.send({
      code : 404 ,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
