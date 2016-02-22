var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/getMessageHeaders', function (req, res, next) {
//Below logic is used to show only the latest message in the inbox page
  Conversation_Room.find(
    { $and: [
    {Users:req.body.emailAddress},
    {Users : {$exists:true}, $where:'this.Users.length<=2'}

]},
    {ChatMessages : {$slice: -1}},
    function (err,msgHeaders) {
      if(err){
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if(msgHeaders!=null){
        res.send({
          code: 200,
          content : msgHeaders,
          msg: 'Message Headers retrieved successfully',
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
