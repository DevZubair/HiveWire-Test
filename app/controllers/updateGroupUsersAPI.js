var express         = require('express'),
  router            = express.Router(),
  mongoose          = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/updateGroupUsers', function (req, res, next) {
  var roomData = req.body,
    currentDate = new Date();
  if(roomData.roomID && roomData.roomUsers)
  {
    Conversation_Room.findOne({_id : roomData.roomID}, function (err, Room) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server Error',
          msg: 'API not called properly',
          token: req.___new__token
        });
      }
      else if (Room != null) {
        Conversation_Room.update({_id: roomData.roomID},
          {
            Users : roomData.roomUsers

          }, function (error, response) {
            res.send({
              code: 200,
              content: 'OK',
              msg: 'Conversation Room Users updated',
              token: req.___new__token,
              DateTime: currentDate,
              conversationID: roomData.roomID
            });
          }
        )
      }
      else {
        res.send({
          code: 404,
          content: 'Not Found',
          msg: 'Room ID not found',
          token: req.___new__token
        });
      }
    });
  }
  else{
    res.send({
      code : 404,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
