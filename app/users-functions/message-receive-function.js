var mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  _receiveLoop = 0;

exports.message_receive_update = function(messageID,emailAddress){
  for(_receiveLoop = 0; _receiveLoop <= messageID.length-1; _receiveLoop++){
    //Following logic is used for nested Array update in mongodb
    Conversation_Room.findOneAndUpdate(
      {'ChatMessages.messageID' : messageID[_receiveLoop]},
      {
        '$addToSet': {
          'ChatMessages.$.receiveAtUser': emailAddress
        }
      },function (err, message_receive_data) {
        if (err) {
          console.log('Internal Server Error');
        }
        else{
          console.log('Message receive update');
        }
      });
  }
};
