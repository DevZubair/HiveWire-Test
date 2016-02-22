var express = require('express'),
  router    = express.Router();

module.exports = function (app) {
  app.use('/admin', router);
};

router.get('/otherUsers', function (req, res, next) {
  res.sendfile('web-portal/otherUsers.html');

});
