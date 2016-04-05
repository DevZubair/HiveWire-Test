var mongoose = require('mongoose'),
  DeviceIdSchema = mongoose.model('DeviceIdSchema'),
  Registration = mongoose.model('Registration'),
  gcm = require('node-gcm'),
  AesEncryptDecrypt = require('../users-functions/aes-functions.js'),
  apns = require("apn"), iosoptions, iosconnection, notification;

//iOS push start
iosoptions = {
  keyFile : "config/key.pem",
  certFile : "config/cert.pem",
  debug : true,
  production : true,
  errorCallback: pushCallbackError,
  gateway: 'gateway.push.apple.com',
  port : 2195,
  batchFeedback  : true

};
var pushCallbackError = function(errorNum, notification){
  console.log('Push Error is: ' + errorNum);
};

iosconnection = new apns.Connection(iosoptions);
iosconnection.on("connected", function() {
  console.log("Connected");
});

iosconnection.on("completed", function () {
  console.log("Completed!");
});

iosconnection.on("transmitted", function(notification) {
  console.log("Transmitted: ", notification);
});

iosconnection.on("socketError", function(err) {
  console.log("Socket error", err.message);
});

iosconnection.on('transmissionError', function(err) {
  console.log("Transmission Error", err);
});

iosconnection.on("error", function(err) {
  console.log("Standard error", err);
});

notification = new apns.Notification();
notification.badge = 1;
notification.sound = "default";

//Android Push Start
var sender = new gcm.Sender('AIzaSyDLSTP86YHbZ3buMq9ShBnO32Hzh4BQlSE');
var message = new gcm.Message();
/*{
 collapseKey: 'hospitalApp',
 notification: {
 title: "Hivewire",
 icon: "images/icon/hospital-icon.png",
 tag : "Hivewire"
 }
 }*/

exports.sendPushes = function (usersID,notificationMessage,senderEmail,conversationID) {

  notification.payload = {'roomID': conversationID};      //For iOS
  var myUsers = usersID;
  var index = myUsers.indexOf(senderEmail);
 /* if (index >= 0){
    myUsers.splice(index, 1);
  }*/
  if(senderEmail != "admin@admin.com") {

    AesEncryptDecrypt.encrypt(senderEmail, function (userEmail) {
      var _encryptEmailAddress = userEmail.content;

      message.addNotification('tag', "Hivewire");   //For Android
      message.addNotification('roomID', conversationID);   //For Android

      mongoose.model('Registration').find({emailAddress: _encryptEmailAddress}, function (err, userData) {
        if (err) {
          console.log('Sender not found')
        }
        else {
          AesEncryptDecrypt.decrypt(userData[0].firstName, function (firstName) {
            var _decryptedFirstName = firstName;
            AesEncryptDecrypt.decrypt(userData[0].lastName, function (lastName) {
              var _decryptedLastName = lastName;
              if(notificationMessage == "!@#$%500MORE)(*&^"){
                message.addData('message', _decryptedFirstName + ' ' + _decryptedLastName + ' sent an Image');   //For Android
                notification.alert = _decryptedFirstName + ' ' + _decryptedLastName + ' sent an Image';               //For iOS
              }
              else{
                message.addData('message', _decryptedFirstName + ' ' + _decryptedLastName + ' sent a message');   //For Android
                notification.alert = _decryptedFirstName + ' ' + _decryptedLastName + ' sent a message';               //For iOS
              }

              mongoose.model('DeviceIdSchema').find({
                $and: [{
                  emailAddress: {

                    $in: myUsers
                  }
                }
                ]
              }, function (err, devicesID) {
                if (err) {
                  console.log('Internal Server Error');
                }
                else if (devicesID != null) {
                  console.log('devicesID found');
                  for (var i = 0; i < devicesID.length; i++) {
                    if (devicesID[i].deviceType == "Android" && devicesID[i].deviceID != '' && devicesID[i].emailAddress != senderEmail) {
                      var regIds = [devicesID[i].deviceID];
                      sender.send(message, {registrationIds: regIds}, function (err, result) {
                        if (err) {
                          console.log(err);
                        }
                        else {
                          console.log(result);
                        }
                      });
                    }
                    else if (devicesID[i].deviceType == "iPhone" && devicesID[i].deviceID != '' && devicesID[i].emailAddress != senderEmail) {
                      console.log("iPhone push sent");
                      var device = new apns.Device(devicesID[i].deviceID);
                      iosconnection.pushNotification(notification,device);

                    }
                    else {
                    }
                  }
                }
                else {
                  console.log('devicesID not found');
                }
              });
            })
          })
        }
      });

    });
  }
  else{
    message.addNotification('tag', "Hivewire");   //For Android

    mongoose.model('Registration').find({emailAddress: senderEmail}, function (err, userData) {
      if (err) {
        console.log('Sender not found')
      }
      else {
        if(notificationMessage == "!@#$%500MORE)(*&^"){
          message.addData('message', userData[0].firstName + ' ' + userData[0].lastName + ' sent an Image');   //For Android
          notification.alert = userData[0].firstName + ' ' + userData[0].lastName + ' sent an Image';               //For iOS
        }
        else{
          message.addData('message', userData[0].firstName + ' ' + userData[0].lastName + ' sent a message');   //For Android
          notification.alert = userData[0].firstName + ' ' + userData[0].lastName + ' sent a message';               //For iOS
        }
        mongoose.model('DeviceIdSchema').find({
          $and: [{
            emailAddress: {

              $in: myUsers
            }
          }
          ]
        }, function (err, devicesID) {
          if (err) {
            console.log('Internal Server Error');
          }
          else if (devicesID != null) {
            console.log('devicesID found');
            for (var i = 0; i < devicesID.length; i++) {
              if (devicesID[i].deviceType == "Android" && devicesID[i].deviceID != '') {
                var regIds = [devicesID[i].deviceID];
                sender.send(message, {registrationIds: regIds}, function (err, result) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log(result);
                  }
                });
              }
              else if (devicesID[i].deviceType == "iPhone" && devicesID[i].deviceID != '') {
                console.log("iPhone push sent");
                var device = new apns.Device(devicesID[i].deviceID);
                iosconnection.pushNotification(notification,device);

              }
              else {
              }
            }
          }
          else {
            console.log('devicesID not found');
          }
        });
      }
    });
  }
};
