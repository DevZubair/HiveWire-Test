var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Registration = mongoose.model('Registration');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/adminChangePass', function (req, res, next) {

  var _registrationData = req.body,
    _userEmail = _registrationData.emailAddress,
    _verificationCode = _registrationData.verificationCode,
    _password = _registrationData.password;

  function emailDomainCheck()
  {
    if(_registrationData.verificationCode && _registrationData.password && _registrationData.emailAddress)
    {
      Registration.findOne({emailAddress:_userEmail},function(err,data) {

        if(err){
          res.send({
            code : 500,
            content : 'Internal Server Error',
            msg : 'API not called properly'
          });
        }
        else if(data){

          if(_verificationCode == data.verificationCode){
            Registration.update({"emailAddress":_userEmail},{

              "pinCode" : _password

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
    else {
      res.send({
        code: 404,
        content: 'Not Found',
        msg: 'Missing Credentials'
      });
    }
  }
  emailDomainCheck();
});

