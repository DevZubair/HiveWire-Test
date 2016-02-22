var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/getRoomImage', function (req, res, next) {
  var _imageName = req.body.imageName || req.query.imageName || req.headers['x-access-imageName'],
    _conversationID = req.body.conversationID || req.query.conversationID || req.headers['x-access-conversationID'],

    imageRootPath = 'images/conversationRooms/'+_conversationID + '/' + _imageName,
    options = {
      root: ".",
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

  res.sendFile(imageRootPath, options, function (err) {
    if (err) {
      console.log(err);
      /*  res.send({
       code: 500,
       content: 'Internal Server Error',
       msg: 'API not called properly'
       //   token:  req.___new__token
       });*/
    }
    else {
      console.log('Sent:', _imageName);
      /* res.send({
       code: 200,
       content: 'OK',
       msg: 'Pic sent successfully'
       // token:  req.___new__token
       });*/
    }
  });
});
