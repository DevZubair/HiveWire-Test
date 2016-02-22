var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodemailer = require("nodemailer"),
  Registration = mongoose.model('Registration');


module.exports = function (app) {
  app.use('/', router);
};

router.post('/register', function (req, res, next) {

  var _registrationData = req.body,
    _time = new Date(),
    _randomNumber = '',
    _possibleValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()abcdefghijklmnopqrstuvwxyz' + _time.getTime(),
    _noreplyEmail= 'gregdoctorapp@yahoo.com',
    _userEmail = _registrationData.emailAddress;

  if(_registrationData.firstName && _registrationData.lastName && _registrationData.emailAddress)
  {
    //Encryption of registration data
    var _firstName = encrypt(_registrationData.firstName);
    var _lastName = encrypt(_registrationData.lastName);
    var _emailAddress = encrypt(_registrationData.emailAddress);

    //It will generate a random number for verification
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
      to:  _userEmail, // list of receivers
      subject: "Verification Code", // Subject line
      text: "Verification Code", // plaintext body
      html: '<h3>Please insert the following Code to verify '+ '<a href="#">' + _randomNumber + '</a>' +' </h3>'
    };

    var register_info=new Registration({
      firstName : _firstName,
      lastName : _lastName,
      emailAddress : _emailAddress,
      pinCode : 'NULL',
      verificationCode: _randomNumber,
      isVerified : false,
      sessionToken : '',
      created_at : new Date()

    });

    register_info.save(function(error,data){
      if(error){
        res.send({
          code : 400,
          content : 'Bad Request',
          msg : error.errors.emailAddress.message
        });
      }
      else
      // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
            console.log(error);
            res.send({
              code : 503,
              content : 'Service Unavailable',
              msg : 'Error while email sent'
            });
          }else{
            console.log("Message sent: " + response.message);
            res.send({
              code : 200,
              content : 'OK',
              msg : 'Verification Email Sent'
            });
          }
        });
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
