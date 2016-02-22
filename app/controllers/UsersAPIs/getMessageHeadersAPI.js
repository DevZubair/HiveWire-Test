var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getMessageHeaders', function (req, res, next) {
//Below logic is used to show only the latest message in the inbox page
  var _emailAddress = req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailAddress'];

  Conversation_Room.find(
    {
      $and: [
        {Users:_emailAddress},
        {Users : {$size:2}}
      ]},
    {
      ChatMessages : {$slice: -1 }
    },function(err,msgHeaders) {

      if(err){
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if(msgHeaders.length!=0){
        for(var i=0;i<msgHeaders.length;i++){
          if(i==msgHeaders.length-1 && msgHeaders[i].ChatMessages.length==0){
            res.send({
              code: 200,
              content : msgHeaders,
              msg: 'Message headers retrieved successfully',
              token: req.___new__token
            });
          }
          if(msgHeaders[i].ChatMessages.length!=0){
            for(var j=0;j<msgHeaders[i].ChatMessages.length;j++){
              AesEncryptDecrypt.decrypt(msgHeaders[i].ChatMessages[j].msg,function(userMessage) {
                msgHeaders[i].ChatMessages[j].msg = userMessage;
                if(i==msgHeaders.length-1 && j==msgHeaders[i].ChatMessages.length-1){
                  res.send({
                    code: 200,
                    content : msgHeaders,
                    msg: 'Message headers retrieved successfully',
                    token: req.___new__token
                  });
                }
              })
            }
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
