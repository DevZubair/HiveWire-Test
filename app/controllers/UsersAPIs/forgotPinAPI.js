var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodemailer = require("nodemailer"),
  Registration = mongoose.model('Registration'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/forgotPin', function (req, res, next) {

  var _forgotPinEmail = req.body.emailAddress,
    _time = new Date(),
    _randomNumber = '',
    _possibleValues = '23456789ABCDEFGHJKMNPQRSTUVWXYZ!@#$%^&*()abcdefghjkmnpqrstuvwxyz' + _time.getTime(),
    _noreplyEmail= 'hivewiretest@gmail.com';

  if(_forgotPinEmail)
  {
    //It will generate a random number for verification
    for(var i=0; i< 10; i++)
    {
      _randomNumber += _possibleValues.charAt(Math.floor(Math.random() * _possibleValues.length));
    }

    var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "gmail",
      auth: {
        user: "hivewiretest@gmail.com",
        pass: "h1vew1re"
      }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: _noreplyEmail, // sender address
      to:  _forgotPinEmail, // list of receivers
      subject: "Verification Code", // Subject line
      text: "Verification Code", // plaintext body
      html: '<h3>Please insert the following Code to verify '+ '<a href="#">' + _randomNumber + '</a>' +' </h3>'
    };

    AesEncryptDecrypt.encrypt(_forgotPinEmail,function(userEmail){
      var _encryptEmailAddress  = userEmail.content;

      Registration.findOne({emailAddress:_encryptEmailAddress},function(err,data) {

        if(err){
          res.send({
            code : 500,
            content : 'Internal Server Error',
            msg : 'API not called properly'
          });
        }
        else if(data!=null){

          if(data.isVerified == true){
            smtpTransport.sendMail(mailOptions, function(error, response){
              if(error){
                console.log(error);
                res.send({
                  code : 503,
                  content : 'Service Unavailable',
                  msg : 'Error while email sent'
                });
              }
              else{
                console.log("Message sent: " + response.message);
                res.send({
                  code : 200,
                  content : 'OK',
                  msg : 'Verification Email Sent'
                });
                Registration.update({"emailAddress":_encryptEmailAddress},{

                  "isVerified" : false,
                  "verificationCode" : _randomNumber,
                  "pinCode" : "NULL"

                },function(){

                });
              }
            });
          }
          else{
            res.send({
              code : 404 ,
              content : 'Not Found',
              msg : 'Wrong code, user not Verified'
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
    })
  }
  else{
    res.send({
      code : 404 ,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
