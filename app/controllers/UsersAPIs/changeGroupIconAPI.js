var express         = require('express'),
  router            = express.Router(),
  mongoose          = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  base64 = require('node-base64-image');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/updateGroupIcon', function (req, res, next) {
  var roomData = req.body,
    currentDate = new Date();
  var __time = new Date();
  var __imageFilePossibleName = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' + __time.getTime();
  var __imageName = "";
  for(var i=0; i< 5; i++)
  {
    __imageName += __imageFilePossibleName.charAt(Math.floor(Math.random() * __imageFilePossibleName.length));
  }

  var options = {
    filename: "images/group_icon/"+__imageName
  };
  var imageData = new Buffer(roomData.roomIcon, 'base64');

  base64.base64decoder(imageData, options, function (err, saved) {
    if (err) {
      res.send({
        code: 500,
        content: 'Internal Server Error',
        msg: 'Image save error',
        token: req.___new__token
      });
    }
    else {
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
              roomIcon : __imageName

            }, function (error, response) {
              res.send({
                code: 200,
                content: 'OK',
                msg: 'Conversation Room Icon updated',
                token: req.___new__token,
                DateTime: currentDate,
                conversationID: roomData.roomID,
                roomIcon : __imageName
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
  });
});
