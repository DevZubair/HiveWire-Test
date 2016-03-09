var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodemailer = require("nodemailer"),
  Registration = mongoose.model('Registration'),
  DeviceIdSchema = mongoose.model('DeviceIdSchema'),
  joinAdminRoom = require('../AdminAPIs/joinAdminRoomAPI.js'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/register', function (req, res, next) {

  var _registrationData = req.body,
    _time = new Date(),
    _randomNumber = '',
    _possibleValues = '23456789ABCDEFGHJKMNPQRSTUVWXYZ@#$%^&*()abcdefghjkmnpqrstuvwxyz' + _time.getTime(),
    _noreplyEmail= 'hivewiretest@gmail.com',
    _userEmail = _registrationData.emailAddress,
    _deviceID = _registrationData.deviceID,
    _deviceType = _registrationData.deviceType;

  var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "gmail",
    auth: {
      user: "hivewiretest@gmail.com",
      pass: "h1vew1re"
    }
  });

  function emailDomainCheck(email, domain)
  {
    var parts = email.split('@');
    if (parts.length === 2) {
      if (parts[1] === domain) {

        //Valid email address
        if(_registrationData.firstName && _registrationData.lastName && _registrationData.emailAddress)
        {
          //It will generate a random number for verification
          for(var i=0; i< 6; i++) {
            _randomNumber += _possibleValues.charAt(Math.floor(Math.random() * _possibleValues.length));
            if(i==5){
              // setup e-mail data with unicode symbols
              var mailOptions = {
                from: _noreplyEmail, // sender address
                to:  _userEmail, // list of receivers
                subject: "Verification Code", // Subject line
                text: "Verification Code", // plaintext body
                html: '<h3>Please insert the following Code to verify '+ '<a href="#">' + _randomNumber + '</a>' +' </h3>'
              };
            }
          }

          //Encryption of registration data
          AesEncryptDecrypt.encrypt(_registrationData.firstName,function(firstName){
            var _firstName  = firstName.content;
            AesEncryptDecrypt.encrypt(_registrationData.lastName,function(lastName){
              var _lastName  = lastName.content;
              AesEncryptDecrypt.encrypt(_registrationData.emailAddress,function(emailAddress){
                var _emailAddress = emailAddress.content;

                var register_info=new Registration({
                  firstName : _firstName,
                  lastName : _lastName,
                  emailAddress : _emailAddress,
                  block : false,
                  pinCode : 'NULL',
                  verificationCode: _randomNumber,
                  isVerified : false,
                  sessionToken : '',
                  role : 'User',
                  created_at : new Date(),
                  otherEmail : false
                });

                register_info.save(function(error,data){
                  if(error){
                    res.send({
                      code : 400,
                      content : 'Bad Request',
                      msg : 'Email match found'
                    });
                  }
                  else
                  // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, function(error, response){
                      if(error){
                        console.log(error);
                        res.send({
                          code : 500,
                          content : 'Internal Server error',
                          msg : 'Verification Email could not be sent'
                        });
                      }
                      else{
                        var device_info=new DeviceIdSchema({
                          emailAddress : _registrationData.emailAddress,
                          deviceID : _deviceID,
                          deviceType : _deviceType,
                          toSend : true,
                          created_at : new Date()
                        });
                        device_info.save(function(error,data){
                          if(error){
                            console.log('Error! Device id is not added');
                          }
                          else{
                            console.log('Success! Device id is added');
                          }
                        });
                        joinAdminRoom.joinRoom(_registrationData.emailAddress);
                        res.send({
                          code : 200,
                          content : 'OK',
                          msg : 'Verification Email Sent'
                        });
                      }
                    });
                });
              });
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

      }
      else{
//Invalid Email address
        if(_registrationData.firstName && _registrationData.lastName && _registrationData.emailAddress)
        {
          //It will generate a random number for verification
          for(var i=0; i< 6; i++) {
            _randomNumber += _possibleValues.charAt(Math.floor(Math.random() * _possibleValues.length));
            if(i==5){
              // setup e-mail data with unicode symbols
              var mailOptions1 = {
                from: _noreplyEmail, // sender address
                to:  _userEmail, // list of receivers
                subject: "Hivewire! Sorry Cannot register", // Subject line
                text: "Sorry you cannot register with this email", // plaintext body
                html: '<h3>Please contact us for more queries '+ '<a href="#">' + 'support@hivewire.co.uk' + '</a>' +' </h3>'
              };
            }
          }

          //Encryption of registration data
          AesEncryptDecrypt.encrypt(_registrationData.firstName,function(firstName){
            var _firstName  = firstName.content;
            AesEncryptDecrypt.encrypt(_registrationData.lastName,function(lastName){
              var _lastName  = lastName.content;
              AesEncryptDecrypt.encrypt(_registrationData.emailAddress,function(emailAddress){
                var _emailAddress = emailAddress.content;

                var register_info=new Registration({
                  firstName : _firstName,
                  lastName : _lastName,
                  emailAddress : _emailAddress,
                  block : false,
                  pinCode : 'NULL',
                  verificationCode: _randomNumber,
                  isVerified : false,
                  sessionToken : '',
                  role : 'User',
                  created_at : new Date(),
                  otherEmail : true
                });

                register_info.save(function(error,data){
                  if(error){
                    res.send({
                      code : 400,
                      content : 'Bad Request',
                      msg : 'Email match found'
                    });
                  }
                  else
                  // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions1, function(error, response){
                      if(error){
                        console.log(error);
                        res.send({
                          code : 500,
                          content : 'Internal Server error',
                          msg : 'Verification Email could not be sent'
                        });
                      }
                      else{
                         var device_info=new DeviceIdSchema({
                         emailAddress : _registrationData.emailAddress,
                         deviceID : _deviceID,
                         deviceType : _deviceType,
                         toSend : true,
                         created_at : new Date()
                         });
                         device_info.save(function(error,data){
                         if(error){
                         console.log('Error! Device id is not added');
                         }
                         else{
                         console.log('Success! Device id is added');
                         }
                         });
                         joinAdminRoom.joinRoom(_registrationData.emailAddress);
                        res.send({
                          code : 400,
                          content : 'Bad Request',
                          msg : 'Email address is not registered with @hhft.nhs.uk'
                        });
                      }
                    });
                });
              });
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

      }
    }
    else{
      res.send({
        code : 400 ,
        content : 'Email Not Found',
        msg : 'Please enter a valid Email Address'
      });
    }
  }
  emailDomainCheck(_registrationData.emailAddress,"hhft.nhs.uk");
});

