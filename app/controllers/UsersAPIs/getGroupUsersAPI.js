var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getRoomUsers', function (req, res, next) {

  if(req.body.roomID) {
    Conversation_Room.findOne({_id: req.body.roomID}, function (err, users) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if (users != null) {
        if(users.Users.length != 0) {

          res.send({
            code: 200,
            content: users.Users,
            msg: 'Group Users sent in response',
            token: req.___new__token
          });
        }
      }
      else {
        res.send({
          code: 404,
          content: 'Not Found',
          msg: 'RoomID not found',
          token:  req.___new__token
        });
      }
    });
  }
  else
  {
    res.send({
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials',
      token:  req.___new__token
    });
  }
});
