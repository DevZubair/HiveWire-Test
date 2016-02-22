var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Profiles = mongoose.model('Profiles');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/retrieveContacts', function (req, res, next) {

  Profiles.find(function (err,users) {
    if(err){
      res.send({
        code: 500,
        content : 'Internal Server Error',
        msg: 'API not called properly',
        token:  req.___new__token
      });
    }
    else{
      res.send({
        code: 200,
        content : users,
        msg: 'Users retrieved successfully',
        token: req.___new__token

      });
    }
  })
});
