var express         = require('express'),
  router            = express.Router(),
  mongoose          = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/updateRoomName', function (req, res, next) {
  var roomData = req.body,
    currentDate = new Date();
  if(roomData.roomID && roomData.roomName)
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
            RoomName : roomData.roomName

          }, function (error, response) {
            res.send({
              code: 200,
              content: 'OK',
              msg: 'Conversation Room Name updated',
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
