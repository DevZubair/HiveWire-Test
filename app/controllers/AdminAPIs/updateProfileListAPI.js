var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  ProfileList = mongoose.model('ProfileList');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/updateProfileList', function (req, res, next) {

  var _profileC = req.body.profileCateg,
    _profileName = req.body.profileItem,
    profileMake = req.body.profileMake;

  if (_profileC == 'hospitalName') {

    ProfileList.update({}, {
      $push: {
        hospitalName: _profileName

      },
      updated_at: new Date()
    }, function (err, ProfileData) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server error',
          msg: 'API error'
        });
      }
      else if (ProfileData != null) {

        res.send({
          code: 200,
          content: 'OK',
          msg: 'List updated'
        });
      }
    });
  }
  else if(_profileC == 'grade'){
    ProfileList.update({}, {
      $push: {
        grade: _profileName

      },
      updated_at: new Date()
    }, function (err, ProfileData) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server error',
          msg: 'API error'
        });
      }
      else if (ProfileData != null) {

        res.send({
          code: 200,
          content: 'OK',
          msg: 'List updated'
        });
      }
    });
  }
  else if(_profileC == 'speciality'){
    ProfileList.update({}, {
      $push: {
        speciality: _profileName

      },
      updated_at: new Date()
    }, function (err, ProfileData) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server error',
          msg: 'API error'
        });
      }
      else if (ProfileData != null) {

        res.send({
          code: 200,
          content: 'OK',
          msg: 'List updated'
        });
      }
    });
  }
  else if(_profileC == 'role'){
    ProfileList.update({}, {
      $push: {
        role: _profileName

      },
      updated_at: new Date()
    }, function (err, ProfileData) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server error',
          msg: 'API error'
        });
      }
      else if (ProfileData != null) {

        res.send({
          code: 200,
          content: 'OK',
          msg: 'List updated'
        });
      }
    });
  }
  else if(_profileC == 'job'){
    ProfileList.update({}, {
      $push: {
        job: _profileName

      },
      updated_at: new Date()
    }, function (err, ProfileData) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server error',
          msg: 'API error'
        });
      }
      else if (ProfileData != null) {

        res.send({
          code: 200,
          content: 'OK',
          msg: 'List updated'
        });
      }
    });
  }
  else if(_profileC == 'ward'){
    ProfileList.update({}, {
      $push: {
        ward: _profileName

      },
      updated_at: new Date()
    }, function (err, ProfileData) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server error',
          msg: 'API error'
        });
      }
      else if (ProfileData != null) {

        res.send({
          code: 200,
          content: 'OK',
          msg: 'List updated'
        });
      }
    });
  }
  else if(profileMake == 1){
    var profile_info = new ProfileList({

      hospitalName: [],
      doctor: [],
      nurse: [],
      admin: [],
      job : [],
      professional : [],
      updated_at: new Date()
    });

    profile_info.save(function (error, data) {
      if (error) {
        res.send({
          code: 500,
          content: 'Internal Server Error',
          msg: 'API not called properly'

        });
      }
      else {
        res.send({
          code: 200,
          content: 'OK',
          msg: 'Profile List is saved'
        });
      }
    });
  }
  else{
    res.send({
      code: 404,
      content: 'Category not found',
      msg: 'Error'
    });
  }
});
