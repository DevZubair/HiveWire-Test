var express         = require('express'),
  router            = express.Router(),
  mongoose          = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/updateConversationRoom', function (req, res, next) {
  var roomData = req.body,
    currentDate = new Date();

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
      var uniqueID = mongoose.Types.ObjectId();

      Conversation_Room.update({_id: roomData.roomID},
        {
          $push: {
            ChatMessages: {
              messageID: uniqueID.toString(),
              msg: roomData.chatMessage,
              sender: roomData.msgAuthor,
              dateTime: currentDate,
              seenBy:[],
              receiveAtServer : true,
              receiveAtUser : false
            }
          }
        }, function (error, response) {
          res.send({
            code: 200,
            content: 'OK',
            msg: 'Conversation Room updated',
            token: req.___new__token,
            msgDateTime: currentDate,
            conversationID: roomData.roomID,
            sender: roomData.msgAuthor,
            messageID: uniqueID.toString()
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
});
