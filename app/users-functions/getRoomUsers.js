var mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

exports.getUsers = function (conversationID,callBack) {

  mongoose.model('Conversation_Room').find({_id : conversationID},
    function (err, Room) {
      if (err) {
        console.log('Internal Server Error');
      }
      else if (Room != null) {

        callBack(Room);
      }
      else {
        console.log('Room ID not found');
      }
    });
};
