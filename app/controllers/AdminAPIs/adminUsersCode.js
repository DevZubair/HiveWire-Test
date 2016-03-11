var express = require('express'),
  router    = express.Router();

module.exports = function (app) {
  app.use('/admin', router);
};

router.get('/UsersCode', function (req, res, next) {
  res.sendfile('web-portal/userCode.html');

});
