var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  fs = require('fs'),
  busboy = require('connect-busboy'),
  mkdirp = require('mkdirp');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/uploadRoomImage', function (req, res, next) {
  var conversationID = req.body.conversationID || req.query.conversationID || req.headers['x-access-conversationID'],
    _emailAddress = req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailAddress'],
    _fstream,
    currentDate = new Date();

  mkdirp('images/conversationRooms/' + conversationID, function (err) {
    if (err) {
      console.error(err);
      res.send({
        code: 500,
        content: 'Internal Server Error',
        msg: 'API not called properly',
        token: req.___new__token
      });
    }
    else {
      console.log('New Directory Made!');
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        _fstream = fs.createWriteStream("images/conversationRooms/" + conversationID + "/" + filename);
        file.pipe(_fstream);
        _fstream.on('close', function () {

          //update the image in db
          var uniqueID = mongoose.Types.ObjectId();
          var _imageURL = 'http://doctor-app.evennode.com/images/conversationRooms/'  + conversationID + "/" + filename;
          mongoose.model('Conversation_Room').update({_id: conversationID},
            {
              $push: {
                ChatMessages: {
                  messageID: uniqueID.toString(),
                  msg: '',
                  image: _imageURL,
                  sender: _emailAddress,
                  dateTime: currentDate,
                  seenBy: [],
                  receiveAtServer: true,
                  receiveAtUser: false
                }
              }
            }, function (error, response) {

              if(err) {
                console.log('Room not found');
                res.send({
                  code: 400,
                  content: 'Bad Request',
                  msg: 'Error! Image is not uploaded',
                  token: req.___new__token
                });
              }
              else{
                res.send({
                  code: 200,
                  content: 'OK',
                  msg: 'Image is uploaded',
                  token: req.___new__token,
                  imageURL: _imageURL,
                  conversationID: conversationID,
                  sender: _emailAddress
                });
              }
            });
        });
      });
    }
  });
});
