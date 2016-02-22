var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  jwt          = require('jsonwebtoken'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/sendMessageAll', function (req, res, next) {

  var _pinEmail = req.body.emailAddress,
    _message = req.body.message,
    _conversationID = "Ad@m#i$nRo%^&om",
    currentDate = new Date(),
    uniqueID = mongoose.Types.ObjectId();

  if (_pinEmail && _message) {
    AesEncryptDecrypt.encrypt(_message,function(adminMessage) {
      var _encryptMessage = adminMessage.content;

      mongoose.model('Conversation_Room').update({RoomID: _conversationID}, {
        $push: {
          ChatMessages: {
            messageID: uniqueID.toString(),
            msg: _encryptMessage,
            image: '',
            sender: _pinEmail,
            dateTime: currentDate,
            seenBy: [],
            receiveAtServer: true,
            receiveAtUser: []
          }
        }
      }, function (err, Room) {
        if (err) {
          res.send({
            code: 500,
            content: 'Internal Server error',
            msg: 'API error',
            token: req.___new__token
          });
        }
        else if (Room != null) {

          res.send({
            code: 200,
            content: 'OK',
            msg: 'Message Sent',
            token: req.___new__token,
            messageID: uniqueID.toString()
          });
        }
        else {
          res.send({
            code: 404,
            content: 'Not Found',
            msg: 'Room not found',
            token: req.___new__token
          });
        }
      });
    })
  }
  else {
    res.send({
      code: 404,
      content: 'Not Found',
      msg: 'Missing Credentials',
      token:  req.___new__token
    });
  }
});
