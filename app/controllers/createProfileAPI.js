var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  Registration = mongoose.model('Registration'),
  base64 = require('node-base64-image');

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
  //   _role = _profileData.role,
  //   _gmcNumber = _profileData.gmcNumber,
   // _profilePic = _profileData.profilePic,
    _userUniqueID = '';

  if(_userEmail && _userFirstName && _userLastName && _hospitalName && _grade && _speciality)
  {
    Registration.update({"emailAddress": _userEmail}, {

      "firstName": _userFirstName,
      "lastName": _userLastName

    }, function () {

    });
    Registration.findOne({emailAddress: _userEmail}, function (err, data) {

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
        Profiles.findOne({emailAddress: _userEmail}, function (err, data) {

          if (err) {
            res.send({
              code: 500,
              content: 'Internal Server Error',
              msg: 'API not called properly',
              token:  req.___new__token
            });
          }
          else if(data){

            Profiles.update({"emailAddress": _userEmail}, {

              "firstName": _userFirstName,
              "lastName": _userLastName,
              "emailAddress": _userEmail,
              "hospitalName": _hospitalName,
              "grade": _grade,
              "speciality": _speciality,
              // "role": _role,
              // "gmcNumber": _gmcNumber,
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
              firstName: _userFirstName,
              lastName: _userLastName,
              emailAddress: _userEmail,
              hospitalName: _hospitalName,
              grade: _grade,
              speciality: _speciality,
              // role: _role,
              // gmcNumber: _gmcNumber,
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
