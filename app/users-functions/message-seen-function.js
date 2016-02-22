var mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  _seenLoop = 0;

//Functions for db update
exports.message_seen_update = function(messageID,emailAddress){
  for(_seenLoop = 0; _seenLoop <= messageID.length-1; _seenLoop++){

    //Following logic is used for nested Array update in mongodb
    Conversation_Room.findOneAndUpdate(

      {'ChatMessages.messageID' : messageID[_seenLoop]},
      {
        '$addToSet': {
          'ChatMessages.$.seenBy': emailAddress
        }},function (err, seen_message_data) {
        if (err) {
          console.log('Internal Server Error');
        }
        else {
          console.log('Message seen update');
        }
      });
  }
};
