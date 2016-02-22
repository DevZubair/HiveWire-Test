var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getConversationGroups', function (req, res, next) {
//Below the logic is to get those rooms only where users length is more than 2 and email address of user should exist also
  Conversation_Room.find({
      $and: [
        {Users: req.body.emailAddress},
        {Users : {$exists:true}, $where:'this.Users.length>2'}
      ]},
    function (err,groups) {
      if(err){
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if(groups!=null){
        res.send({
          code: 200,
          content : groups,
          msg: 'Conversation Groups retrieved successfully',
          token: req.___new__token
        });
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
