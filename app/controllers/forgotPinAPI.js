var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodemailer = require("nodemailer"),
  Registration = mongoose.model('Registration');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/forgotPin', function (req, res, next) {

  var _forgotPinEmail = req.body.emailAddress,
    _time = new Date(),
    _randomNumber = '',
    _possibleValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()abcdefghijklmnopqrstuvwxyz' + _time.getTime(),
    _noreplyEmail= 'gregdoctorapp@yahoo.com';

  if(_forgotPinEmail)
  {
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
      to:  _forgotPinEmail, // list of receivers
      subject: "Verification Code", // Subject line
      text: "Verification Code", // plaintext body
      html: '<h3>Please insert the following Code to verify '+ '<a href="#">' + _randomNumber + '</a>' +' </h3>'
    };

    Registration.findOne({emailAddress:_forgotPinEmail},function(err,data) {

      if(err){
        res.send({
          code : 500,
          content : 'Internal Server Error',
          msg : 'API not called properly'
        });
      }
      else if(data!=''){

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
              Registration.update({"emailAddress":_forgotPinEmail},{

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
  }
  else{
    res.send({
      code : 404 ,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
