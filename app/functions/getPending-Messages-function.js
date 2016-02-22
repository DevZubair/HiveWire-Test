var mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room');

//Get Pending messages
exports.getPendingMessages = function (userEmail,callBack) {

  Conversation_Room.aggregate(

  {$match :
  {$and: [
    {"ChatMessages.receiveAtUser": false},
    {"Users":userEmail}
  ]}
  },
  {
    $unwind : "$ChatMessages"
  },
  {
    $match: {
      $and: [
        {"ChatMessages.receiveAtUser": false},
        {"ChatMessages.sender": {$ne: userEmail}},
        {"Users": userEmail}
      ]
    }
  },function (err,pendingMessages) {
    if(err){
      console.log('Error in API');
    }
    else{
      console.log('Pending messages retrieved successfully');
      callBack(pendingMessages);
    }
  });
};
