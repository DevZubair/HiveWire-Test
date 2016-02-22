var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  Registration = mongoose.model('Registration'),
  fs = require('fs'),
  busboy = require('connect-busboy'),
  mkdirp = require('mkdirp');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/uploadProfileImage', function (req, res, next) {
  var _emailAddress = req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailAddress'],
    _fstream,
    currentDate = new Date(),
    _userUniqueID = '';

  mkdirp('images/profile_pic/', function (err) {
    if (err) {
      console.error(err);
      res.send({
        code: 500,
        content: 'Internal Server Error',
        msg: 'API not called properly',
        token: req.___new__token
      });
    }
    else {
      console.log('New Directory Made!');
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        _fstream = fs.createWriteStream("images/profile_pic/" + filename);
        file.pipe(_fstream);
        _fstream.on('close', function () {
          var _imageURL = 'http://doctor-app.evennode.com/images/profile_pic/' + filename;
          //update the image in db
          Registration.findOne({emailAddress: _emailAddress}, function (err, data) {

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
              Profiles.findOne({emailAddress: _emailAddress}, function (err, data) {

                if (err) {
                  res.send({
                    code: 500,
                    content: 'Internal Server Error',
                    msg: 'API not called properly',
                    token:  req.___new__token
                  });
                }
                else if(data){

                  Profiles.update({"emailAddress": _emailAddress}, {

                    "profilePic" : _imageURL,
                    "updated_at": new Date()

                  }, function () {
                    res.send({
                      code: 200,
                      content : 'OK',
                      msg: 'Profile Image is updated',
                      token: req.___new__token,
                      imageURL: _imageURL
                    });
                  });
                }
                else {

                  var profile_info = new Profiles({
                    userID: _userUniqueID,
                    firstName: '',
                    lastName: '',
                    emailAddress: '',
                    hospitalName: '',
                    grade: '',
                    speciality: '',
                    // role: '',
                    // gmcNumber: '',
                    profilePic: _imageURL,
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
                        msg: 'Profile Image is saved',
                        token: req.___new__token,
                        imageURL: _imageURL
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
        });
      });
    }
  });
});
