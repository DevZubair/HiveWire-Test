var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getProfile', function (req, res, next) {
  if(req.body.emailAddress) {

    AesEncryptDecrypt.encrypt(req.body.emailAddress,function(userEmail){
      var _encryptEmailAddress  = userEmail.content;

      Profiles.findOne({emailAddress: _encryptEmailAddress}, function (err, profile) {
        if (err) {
          res.send({
            code: 500,
            content: 'Internal Server Error',
            msg: 'API not called properly',
            token:  req.___new__token
          });
        }
        else if (profile != null) {
          AesEncryptDecrypt.decrypt(profile.firstName, function (firstName) {
            profile.firstName=firstName;
            AesEncryptDecrypt.decrypt(profile.lastName, function (lastName) {
              profile.lastName=lastName;
              AesEncryptDecrypt.decrypt(profile.emailAddress, function (emailAddress) {
                profile.emailAddress=emailAddress;
                AesEncryptDecrypt.decrypt(profile.hospitalName, function (hospitalName) {
                  profile.hospitalName=hospitalName;
                  AesEncryptDecrypt.decrypt(profile.grade, function (grade) {
                    profile.grade=grade;
                    AesEncryptDecrypt.decrypt(profile.speciality, function (speciality) {
                      profile.speciality=speciality;
                      AesEncryptDecrypt.decrypt(profile.role, function (role) {
                        profile.role=role;
                        AesEncryptDecrypt.decrypt(profile.gmcNumber, function (gmcNumber) {
                          profile.gmcNumber=gmcNumber;
                          AesEncryptDecrypt.decrypt(profile.job, function (job) {
                            profile.job=job;
                            AesEncryptDecrypt.decrypt(profile.ward, function (ward) {
                              profile.ward=ward;

                              res.send({
                                code: 200,
                                content: profile,
                                msg: 'Profile data sent in response',
                                token: req.___new__token
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        }
        else {
          res.send({
            code: 404,
            content: 'Not Found',
            msg: 'Email Address not found',
            token:  req.___new__token
          });
        }
      });
    })
  }
  else
  {
    res.send({
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials',
      token:  req.___new__token
    });
  }
});
