var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  jwt          = require('jsonwebtoken');

exports.joinRoom = function (emailAddress) {

  var _pinEmail = emailAddress,
      _conversationID = 'Ad@m#i$nRo%^&om';

  if (_pinEmail && _conversationID) {
    mongoose.model('Conversation_Room').update(
      { RoomID: _conversationID },
      { $addToSet: { Users: _pinEmail }

      },function (err, Room) {
      if (err) {
       console.log('User did not join Admin Room')
      }
      else if (Room!=null && Room.n == 1) {

        console.log('User joined Admin Room')
      }
      else {
        console.log('User did not join Admin Room')
      }
    });
  }
  else {
    console.log('User did not join Admin Room')
  }
};
