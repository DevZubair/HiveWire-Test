var mongoose = require('mongoose'),
  Conversation_Room = mongoose.model('Conversation_Room'),
  DeviceIdSchema = mongoose.model('DeviceIdSchema'),
  AesEncryptDecrypt = require('../users-functions/aes-functions.js');

//Get Pending messages
exports.getPendingMessages = function (userEmail,callBack) {

  DeviceIdSchema.update(
    {"emailAddress" : userEmail},
    {"toSend" : false}, function (err,success) {

      if(err){
      }
      else{
        //Below logic is used to get those messages in a single array whose sender and receiveAtUser is not the one we are passing
        Conversation_Room.aggregate(
          {$match :
          {$and: [
            {"Users":userEmail}
          ]}
          },
          {
            $unwind : "$ChatMessages"
          },
          {
            $match: {
              $and: [
                {"ChatMessages.receiveAtUser": {$nin: [userEmail]}},
               // {"ChatMessages.sender": {$ne: userEmail}},
                {"Users": userEmail}
              ]
            }
          },function (err,pendingMessages) {
            if(err){
              console.log('Error in API');
            }
            else {
              console.log('Pending messages retrieved successfully');
              if (pendingMessages.length != 0) {
                for (var i = 0; i < pendingMessages.length; i++) {
                  AesEncryptDecrypt.decrypt(pendingMessages[i].ChatMessages.msg, function (message) {
                    pendingMessages[i].ChatMessages.msg = message;
                    if (i == pendingMessages.length - 1) {
                      callBack(pendingMessages);
                    }
                  })
                }
              }
              else{
                callBack(pendingMessages);
              }
            }
          });
      }
    });
};
