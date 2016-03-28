var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  ProfileList = mongoose.model('ProfileList');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/getProfileJobs', function (req, res, next) {

  ProfileList.find({},{admin:0,professional:0,nurse:0,doctor:0,hospitalName:0}, function (err, jobs) {
    if (err) {
      res.send({
        code: 500,
        content: 'Internal Server Error',
        msg: 'API not called properly'
      });
    }
    else {
      res.send({
        code: 200,
        content: jobs,
        msg: 'Jobs retrieved successfully'
      });
    }
  })

});
