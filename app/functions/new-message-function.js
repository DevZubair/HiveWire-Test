var mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

exports.saveMessage = function (conversationID,uniqueID,message,userEmail,currentDate,callBack) {

  mongoose.model('Conversation_Room').findByIdAndUpdate({_id : conversationID},{
    $push: {
      ChatMessages: {
        messageID: uniqueID.toString(),
        msg: message,
        image: '',
        sender: userEmail,
        dateTime: currentDate,
        seenBy: [],
        receiveAtServer: true,
        receiveAtUser: false
      }
    }
  }, function (err, Room) {
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
