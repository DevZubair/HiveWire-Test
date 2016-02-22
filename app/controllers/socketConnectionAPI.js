var express = require('express'),
  router    = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/socketConnection:5000/socket.io/1', function (req, res, next) {
  res.send({
    code: 200,
    content : 'OK',
    msg: 'Authentication Successful',
    token : req.___new__token
  });
});
