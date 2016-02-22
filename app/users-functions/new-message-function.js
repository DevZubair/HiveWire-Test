var mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  AesEncryptDecrypt = require('../users-functions/aes-functions.js');

exports.saveMessage = function (conversationID,uniqueID,message,userEmail,currentDate,callBack) {

  AesEncryptDecrypt.encrypt(message,function(userMessage) {
    var _encryptMessage = userMessage.content;

    mongoose.model('Conversation_Room').findByIdAndUpdate({_id: conversationID}, {
      $push: {
        ChatMessages: {
          messageID: uniqueID.toString(),
          msg: _encryptMessage,
          image: '',
          sender: userEmail,
          dateTime: currentDate,
          seenBy: [],
          receiveAtServer: true,
          receiveAtUser: []
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
  })
};
