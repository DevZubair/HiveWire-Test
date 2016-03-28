var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  ProfileList = mongoose.model('ProfileList');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/updateProfileList', function (req, res, next) {

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
          msg: 'Profile List is created'
        });
      }
    });

});
