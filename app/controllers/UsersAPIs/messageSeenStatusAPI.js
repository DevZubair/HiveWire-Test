var express         = require('express'),
  router            = express.Router(),
  mongoose          = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/messageSeenStatus', function (req, res, next) {
  var roomData = req.body,
    currentDate = new Date();
//Following logic is used for nested Array update in mongodb
  Conversation_Room.update(
    {'ChatMessages.messageID' : roomData.messageID},
    {
      '$addToSet': {
        'ChatMessages.$.seenBy': roomData.emailAddress
      }
    },function (err, data) {
      if (err) {
        res.send({
          code: 500,
          content: 'Internal Server Error',
          msg: 'API not called properly',
          token: req.___new__token
        });
      }
      else{
        Conversation_Room.find({

          ChatMessages :
          {
            $elemMatch:
            {
              messageID: roomData.messageID
            }
          }

        }, function (err,Room) {
          if(err){
            res.send({
              code: 500,
              content: 'Internal Server Error',
              msg: 'Error while fetching',
              token: req.___new__token
            });
          }
          else{
            res.send({
              code: 200,
              content: 'OK',
              msg: 'Message seen update',
              token: req.___new__token,
              msgDateTime: currentDate,
              conversationID: roomData.roomID,
              messageID: roomData.messageID
            });
          }
        });
      }
    });
});
