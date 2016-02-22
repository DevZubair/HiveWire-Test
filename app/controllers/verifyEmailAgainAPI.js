var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodemailer = require("nodemailer"),
  Registration = mongoose.model('Registration');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/sendVerifyEmail', function (req, res, next) {

  var _verifyEmail = req.body.emailAddress,
    _time = new Date(),
    _randomNumber = '',
    _possibleValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()abcdefghijklmnopqrstuvwxyz' + _time.getTime(),
    _noreplyEmail= 'gregdoctorapp@yahoo.com';

  if(_verifyEmail){       //It will check the credentials coming from app
    for(var i=0; i< 10; i++)
    {
      _randomNumber += _possibleValues.charAt(Math.floor(Math.random() * _possibleValues.length));
    }
    var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "GMAIL",
      auth: {
        user: "gregdoctorapp@gmail.com",
        pass: "world@123456"
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

    Registration.findOne({emailAddress:_verifyEmail},function(error,data){

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
  }
  else{
    res.send({
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
