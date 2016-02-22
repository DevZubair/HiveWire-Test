var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  Registration = mongoose.model('Registration'),
  base64 = require('node-base64-image'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/createProfile', function (req, res, next) {

  var _profileData = req.body,
    _userEmail = _profileData.emailAddress,
    _userFirstName = _profileData.firstName,
    _userLastName = _profileData.lastName,
    _hospitalName = _profileData.hospitalName,
    _grade = _profileData.grade,
    _speciality = _profileData.speciality,
    _role = _profileData.role,
    _gmcNumber = _profileData.gmcNumber,
    _job = _profileData.job,
    _ward = _profileData.ward,
    _userUniqueID = '';

  if(_userEmail && _job)
  {
    if(typeof _gmcNumber=== 'Number'){
      _gmcNumber.toString();
    }

    AesEncryptDecrypt.encrypt(_userEmail,function(userEmail){
      var _encryptEmailAddress  = userEmail.content;
      AesEncryptDecrypt.encrypt(_userFirstName,function(firstName){
        var _encryptFirstName  = firstName.content;
        AesEncryptDecrypt.encrypt(_userLastName,function(lastName){
          var _encryptLastName  = lastName.content;
          AesEncryptDecrypt.encrypt(_hospitalName,function(hospitalName){
            var _encryptHospitalName  = hospitalName.content;
            AesEncryptDecrypt.encrypt(_grade,function(grade){
              var _encryptGrade  = grade.content;
              AesEncryptDecrypt.encrypt(_speciality,function(speciality){
                var _encryptSpeciality  = speciality.content;
                AesEncryptDecrypt.encrypt(_role,function(role){
                  var _encryptRole = role.content;
                  AesEncryptDecrypt.encrypt(_gmcNumber,function(gmcNumber){
                    var _encryptGMC= gmcNumber.content;
                    AesEncryptDecrypt.encrypt(_job,function(job){
                      var _encryptJob = job.content;
                      AesEncryptDecrypt.encrypt(_ward,function(ward){
                        var _encryptWard = ward.content;

                        Registration.update({"emailAddress": _encryptEmailAddress}, {

                          "firstName": _encryptFirstName,
                          "lastName": _encryptLastName

                        }, function () {

                        });
                        Registration.findOne({emailAddress: _encryptEmailAddress}, function (err, data) {

                          if (err) {
                            res.send({
                              code: 500,
                              content : 'Internal Server Error',
                              msg: 'API not called properly',
                              token:  req.___new__token
                            });
                          }
                          else if (data) {
                            _userUniqueID = data.id;
                            Profiles.findOne({emailAddress: _encryptEmailAddress}, function (err, data) {

                              if (err) {
                                res.send({
                                  code: 500,
                                  content: 'Internal Server Error',
                                  msg: 'API not called properly',
                                  token:  req.___new__token
                                });
                              }
                              else if(data){

                                Profiles.update({"emailAddress": _encryptEmailAddress}, {

                                  "firstName": _encryptFirstName,
                                  "lastName": _encryptLastName,
                                  "emailAddress": _encryptEmailAddress,
                                  "hospitalName": _encryptHospitalName,
                                  "grade": _encryptGrade,
                                  "speciality": _encryptSpeciality,
                                  "role": _encryptRole,
                                  "gmcNumber": _encryptGMC,
                                  "job" : _encryptJob,
                                  "ward" : _encryptWard,
                                  "updated_at": new Date()

                                }, function () {
                                  res.send({
                                    code: 200,
                                    content : 'OK',
                                    msg: 'User Profile is updated',
                                    token: req.___new__token
                                  });
                                });
                              }
                              else {

                                var profile_info = new Profiles({
                                  userID: _userUniqueID,
                                  firstName: _encryptFirstName,
                                  lastName: _encryptLastName,
                                  emailAddress: _encryptEmailAddress,
                                  hospitalName: _encryptHospitalName,
                                  grade: _encryptGrade,
                                  speciality: _encryptSpeciality,
                                  role: _encryptRole,
                                  gmcNumber: _encryptGMC,
                                  job : _encryptJob,
                                  ward : _encryptWard,
                                  profilePic: '',
                                  updated_at: new Date()
                                });

                                profile_info.save(function (error, data) {
                                  if (error) {
                                    res.send({
                                      code: 500,
                                      content: 'Internal Server Error',
                                      msg: 'API not called properly',
                                      token: req.___new__token
                                    });
                                  }
                                  else {
                                    res.send({
                                      code: 200,
                                      content: 'OK',
                                      msg: 'User Profile is saved',
                                      token: req.___new__token
                                    });
                                  }
                                })
                              }
                            })
                          }
                          else {
                            res.send({
                              code: 404,
                              content : 'Not Found',
                              msg: 'Email Address/User not found',
                              token:  req.___new__token
                            });
                          }
                        });
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }
  else{
    res.send({
      code : 404 ,
      content : 'Not Found',
      msg : 'Missing Credentials',
      token:  req.___new__token
    });
  }
});
