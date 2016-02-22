var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getConversationGroups', function (req, res, next) {
//Below the logic is to get those rooms only where users length is more than 2 and email address of user should exist also
  Conversation_Room.find(
    {
      $and: [
        {Users: req.body.emailAddress},
        {Users : {$exists:true}, $where:'this.Users.length>2'}
      ]},
    {
      'ChatMessages' : {$slice : -1}
    },
    function (err,groups) {
      if(err){
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if(groups.length!=0){
        for(var i=0;i<groups.length;i++){
          if(i==groups.length-1 && groups[i].ChatMessages.length==0){
            res.send({
              code: 200,
              content : groups,
              msg: 'Conversation Groups retrieved successfully',
              token: req.___new__token
            });
          }
          if(groups[i].ChatMessages.length!=0) {
            for (var j = 0; j < groups[i].ChatMessages.length; j++) {
              AesEncryptDecrypt.decrypt(groups[i].ChatMessages[j].msg, function (userMessage) {
                groups[i].ChatMessages[j].msg = userMessage;
                if (i == groups.length - 1 && j == groups[i].ChatMessages.length - 1) {
                  res.send({
                    code: 200,
                    content: groups,
                    msg: 'Conversation Groups retrieved successfully',
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
