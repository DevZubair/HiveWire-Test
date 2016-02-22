var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/createConversationRoom', function (req, res, next) {
  var roomData=req.body;
  if (roomData.roomUsers)
  {
    var chatRoom_data=new Conversation_Room({

      RoomIcon: '',
      RoomName: roomData.roomName,
      Users: roomData.roomUsers,
      ChatMessages: []

    });
    chatRoom_data.save(function(error,response){
      if(error){
        res.send({
          code : 400,
          content : 'Bad Request',
          msg : 'Room not created, Internal Server Error',
          token: req.___new__token
        });
      }
      else
        res.send({
          code : 200,
          content : 'OK',
          msg : 'Conversation Room Created Successfully',
          token : req.___new__token,
          conversationID: response.id
        });
    });
  }
  else{
    res.send({
      code : 404 ,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });
  }
});
