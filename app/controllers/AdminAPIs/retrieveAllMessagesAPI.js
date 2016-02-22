var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/getAllRooms', function (req, res, next) {

  Conversation_Room.find({})
    .select("-__v")   //It is used to exclude a field from response
    .exec(function(err,allRooms) {

      if(err){
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if(allRooms!=null){
        for(var i=0;i<allRooms.length;i++){
          for(var j=0;j<allRooms[i].ChatMessages.length;j++){
            AesEncryptDecrypt.decrypt(allRooms[i].ChatMessages[j].msg,function(userMessage) {
              allRooms[i].ChatMessages[j].msg = userMessage;
              if(i==allRooms.length-1 && j==allRooms[i].ChatMessages.length-1){
                res.send({
                  code: 200,
                  content : allRooms,
                  msg: 'Messages Rooms retrieved successfully',
                  token: req.___new__token
                });
              }
            })
          }
        }
      }
      else {
        res.send({
          code: 404,
          content: 'Not Found',
          msg: 'No message found',
          token:  req.___new__token
        });
      }
    })
});
