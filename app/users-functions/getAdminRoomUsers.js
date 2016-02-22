var mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

exports.getUsersAdmin = function (userEmail,callBack) {

  mongoose.model('Conversation_Room').find({RoomID : "Ad@m#i$nRo%^&om"},
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
