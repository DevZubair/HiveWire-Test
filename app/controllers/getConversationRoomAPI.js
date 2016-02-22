var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getConversationRoom', function (req, res, next) {

  if(req.body.roomID) {
    Conversation_Room.findOne({_id: req.body.roomID}, function (err, messages) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if (messages != null) {
        res.send({
          code: 200,
          content: messages.ChatMessages,
          msg: 'Messages data sent in response',
          token: req.___new__token
        });
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
