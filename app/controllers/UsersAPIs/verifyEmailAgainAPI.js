var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodemailer = require("nodemailer"),
  Registration = mongoose.model('Registration'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/sendVerifyEmail', function (req, res, next) {

  var _verifyEmail = req.body.emailAddress,
    _time = new Date(),
    _randomNumber = '',
    _possibleValues = '23456789ABCDEFGHJKMNPQRSTUVWXYZ!@#$%^&*()abcdefghjkmnpqrstuvwxyz' + _time.getTime(),
    _noreplyEmail= 'hivewiretest@gmail.com';

  if(_verifyEmail){       //It will check the credentials coming from app
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
      to:  _verifyEmail, // list of receivers
      subject: "Verification Code", // Subject line
      text: "Verification Code", // plaintext body
      html: '<h3>Please insert the following Code to verify '+ '<a href="#">' + _randomNumber + '</a>' +' </h3>'
    };

    AesEncryptDecrypt.encrypt(_verifyEmail,function(userEmail){
      var _encryptEmailAddress  = userEmail.content;

      Registration.findOne({emailAddress:_encryptEmailAddress},function(error,data){

        if(data)
        {
          if(data.isVerified == false)
          {
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
              }
            });
          }
          else
          {
            res.send({
              code : 400,
              content : 'Bad Request',
              msg : 'Email Address is already verified'
            });
          }
        }
        else
        {
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
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
