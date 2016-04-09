var express   = require('express'),
  app         = express(),
  config      = require('./config/config'),
  bodyParser  = require('body-parser'),
  glob        = require('glob'),
  mongoose    = require('mongoose'),
  server      = app.listen(config.port),
  io          = require('socket.io').listen(server);

//Connecting database
mongoose.connect(config.db);

var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

//Connecting Schemas
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

require('./config/express')(app, config);

//Socket connection with namespace
var clients = [],
  messageSeen = require('./app/users-functions/message-seen-function'),
  messageReceive = require('./app/users-functions/message-receive-function.js'),
  pendingMessages = require('./app/users-functions/getPending-Messages-function.js'),
  newMessage = require('./app/users-functions/new-message-function.js'),
  pushNotification = require('./app/users-functions/push-notification-function.js'),
  getAdminRoom = require('./app/users-functions/getAdminRoomUsers.js'),
  checkToken = require('./app/users-functions/checkSessionToken.js'),
  getRoomUsers = require('./app/users-functions/getRoomUsers.js'),
  DeviceIdSchema = mongoose.model('DeviceIdSchema');

io.on('connection', function (socket) {

  //When User Connected
  console.log('USER connected' + socket.id);

  socket.on('user_online', function(onlineData) {

    var _emittingOnlineMethod = function (pendingMessages) {
      console.log("user_online method is called");
      socket.emit('user_online', {
        userEmail: onlineData.userEmail,
        pendingMessages : pendingMessages
      });
    };
    socket.emailAddress=onlineData.userEmail;

    console.log("----------- user_online -------------");
    console.log("userEmail-------" + onlineData.userEmail);

    //Calling function for getting pending messages
    pendingMessages.getPendingMessages(onlineData.userEmail,function(MessagesToReceive){

      _emittingOnlineMethod(MessagesToReceive);
    });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new_message', function (data) {

    var currentDate = new Date(),
      conversationID =  data.conversationID,
      message = data.message,
      userEmail = data.userEmail,
      uniqueID = mongoose.Types.ObjectId(),
      token = data.sessionToken;

    console.log("----------- new_message -------------");
    console.log("conversationID-------" + conversationID);
    console.log("message-------" + message);
    console.log("userEmail-------" + userEmail);

    newMessage.saveMessage(conversationID, uniqueID, message, userEmail, currentDate, function (Room) {

      //for push Notification
      pushNotification.sendPushes(Room.Users, message, userEmail, conversationID);

      console.log(userEmail + ' sends "' + message + '"');
      clients = io.sockets.sockets;
      for (var k in clients) {
        // we tell the client to execute 'new message'
        if (Room.Users.indexOf(clients[k].emailAddress) >= 0) {
          console.log('Socket message response to : ' + userEmail);

          messageReceive.message_receive_update([uniqueID],userEmail);

          io.sockets.connected[clients[k].id].emit('new_message', {
            userEmail: userEmail,
            message: message,
            messageID: uniqueID.toString(),
            conversationID: conversationID,
            dateTime: currentDate,
            roomName: Room.RoomName,
            roomUsers: Room.Users,
            offlineMessageId : data.offlineMessageId,
            offlineTime : data.offlineTime
          });
        }

        else {

        }
      }
    });

    /* checkToken.checkExpiryToken(userEmail,token,function(token){
     if(token=="Token Expired"){
     console.log("Token Expired response is sent");
     getRoomUsers.getUsers(conversationID, function(roomUsers)  {
     clients = io.sockets.sockets;
     for(var k in clients)
     {
     // we tell the client to execute 'new message'
     if(clients[k].emailAddress == userEmail)
     {
     console.log('Token expired response is sent to the sender only');
     io.sockets.connected[clients[k].id].emit('new_message', {
     userEmail: userEmail,
     message: message,
     messageID: uniqueID.toString(),
     conversationID: conversationID,
     dateTime: currentDate,
     roomName : roomUsers.RoomName,
     roomUsers : roomUsers.Users,
     token : token
     });
     break;
     }
     else{

     }
     }
     })
     }
     else {
     console.log("Correct Token response is sent");
     newMessage.saveMessage(conversationID, uniqueID, message, userEmail, currentDate, function (Room) {

     //for push Notification
     pushNotification.sendPushes(Room.Users, message, userEmail, conversationID);

     console.log(userEmail + ' sends "' + message + '"');
     clients = io.sockets.sockets;
     for (var k in clients) {
     // we tell the client to execute 'new message'
     if (Room.Users.indexOf(clients[k].emailAddress) >= 0) {
     if(clients[k].emailAddress == userEmail){
     console.log('Response of token is sent to sender only');
     io.sockets.connected[clients[k].id].emit('new_message', {
     userEmail: userEmail,
     message: message,
     messageID: uniqueID.toString(),
     conversationID: conversationID,
     dateTime: currentDate,
     roomName: Room.RoomName,
     roomUsers: Room.Users,
     token: token
     });
     }
     else{
     console.log('Response of message is sent to all room users excluding sender');
     io.sockets.connected[clients[k].id].emit('new_message', {
     userEmail: userEmail,
     message: message,
     messageID: uniqueID.toString(),
     conversationID: conversationID,
     dateTime: currentDate,
     roomName: Room.RoomName,
     roomUsers: Room.Users
     });
     }
     }
     else {

     }
     }
     });
     }
     });*/
  });

// when the client emits 'typing', we broadcast it to others
  socket.on('typing', function (data) {

    var conversationID = data.conversationID,
      userEmail = data.userEmail,
      roomUsers = data.roomUsers;

    clients = io.sockets.sockets;
    for(var k in clients) {
      //socket emit method
      if (roomUsers.indexOf(clients[k].emailAddress) >= 0) {
        // we tell the client to execute 'new message'

        io.sockets.connected[clients[k].id].emit('typing', {
          userEmail: userEmail,
          conversationID: conversationID
        });
        console.log(userEmail + ' is typing "');
      }
    }
  });

// when the client emits 'stop typing', we broadcast it to others
  socket.on('stop_typing', function (data) {
    var conversationID = data.conversationID,
      userEmail = data.userEmail,
      roomUsers = data.roomUsers;

    clients = io.sockets.sockets;
    for(var k in clients) {
      //socket emit method
      if (roomUsers.indexOf(clients[k].emailAddress) >= 0) {
        // we tell the client to execute 'new message'

        io.sockets.connected[clients[k].id].emit('stop_typing', {
          userEmail: userEmail,
          conversationID: conversationID

        });
        console.log(userEmail + ' is not typing "');
      }
    }
  });

// when the user disconnects.. perform this
  socket.on('disconnect', function (data) {

    console.info('Client disconnected (id=' + socket.id + ').');
    DeviceIdSchema.update(
      {"emailAddress" : socket.emailAddress},
      {"toSend" : true}, function (err,success) {

        if (err) {
          console.log('Error!' + socket.emailAddress + ' is not disconnected from db');
        }
        else {
          console.log('Success!' + socket.emailAddress + ' is disconnected from db as well');
        }
      });

    // echo globally that this client has left
    socket.emit('disconnected', {
      // userEmail : data.userEmail
    });
  });

  socket.on('connect', function (data) {

    socket.emit('connect',{

    })
  });

  socket.on('user_offline', function(data) {

    console.log("----------- user_offline -------------");
    console.log("userEmail-------" + socket.emailAddress);

    socket.emit('user_offline', {
      userEmail: data.userEmail
    });
  });
  socket.on('message_seen', function(conversation_data) {

    var messageID = conversation_data.messageID,
      emailAddress = conversation_data.userEmail,
      currentDate = new Date(),
      conversationID = conversation_data.conversationID,
      roomUsers = conversation_data.roomUsers;

    clients = io.sockets.sockets;
    for(var k in clients) {
      //socket emit method
      if (roomUsers.indexOf(clients[k].emailAddress) >= 0) {
        // we tell the client to execute 'message seen'

        io.sockets.connected[clients[k].id].emit('message_seen', {
          userEmail: emailAddress,
          conversationID: conversationID,
          dateTime: currentDate,
          messageID: messageID
        });
      }
    }
    //function call for db update
    messageSeen.message_seen_update(messageID, emailAddress);
    console.log("----------- message_seen -------------");
    console.log("conversationID-------" + conversationID);
    console.log("messageID-------" + messageID);
    console.log("userEmail-------" + emailAddress);

  });

  socket.on('message_receive', function(conversation_data) {
    var messageID = conversation_data.messageID,
      emailAddress = conversation_data.userEmail,
      currentDate = new Date(),
      conversationID = conversation_data.conversationID,
      roomUsers = conversation_data.roomUsers;

    clients = io.sockets.sockets;
    for(var k in clients) {
      //socket emit method
      if (roomUsers.indexOf(clients[k].emailAddress) >= 0) {
        // we tell the client to execute 'message receive'

        io.sockets.connected[clients[k].id].emit('message_receive', {
          userEmail: emailAddress,
          conversationID: conversationID,
          dateTime: currentDate,
          messageID: messageID,
          roomUsers : roomUsers

        });
      }
    }
    //function call for db update
    messageReceive.message_receive_update(messageID,emailAddress);
    console.log("----------- message_receive -------------");
    console.log("conversationID-------" + conversationID);
    console.log("messageID-------" + messageID);
    console.log("userEmail-------" + emailAddress);
  });

  socket.on('image_file', function(conversation_data) {
    var _imageURL = conversation_data.imageURL,
      _conversationID = conversation_data.conversationID,
      currentDate = new Date(),
      _emailAddress = conversation_data.userEmail,
      _messageID = conversation_data.messageID,
      roomUsers = conversation_data.roomUsers,
      message = "!@#$%500MORE)(*&^";

    console.log("----------- image_file -------------");
    console.log("conversationID-------" + _conversationID);
    console.log("_imageURL-------" + _imageURL);
    console.log("userEmail-------" + _emailAddress);

    pushNotification.sendPushes(roomUsers, message, _emailAddress, _conversationID);

    clients = io.sockets.sockets;
    for(var k in clients) {
      //socket emit method
      if (roomUsers.indexOf(clients[k].emailAddress) >= 0) {
        // we tell the client to execute 'new message'

        io.sockets.connected[clients[k].id].emit('image_file', {
          userEmail: _emailAddress,
          conversationID: _conversationID,
          dateTime: currentDate,
          imageURL: _imageURL,
          messageID: _messageID
        });
      }
    }
  });

//Only for admin
  socket.on('adminMessage', function (message) {

    getAdminRoom.getUsersAdmin(message.emailAddress,function(Room){
      //for push Notification
      pushNotification.sendPushes(Room[0].Users,message.admin_message,message.emailAddress);

      socket.broadcast.emit('new_message',{
        userEmail: message.emailAddress,
        message: message.admin_message,
        messageID: message.messageID,
        dateTime: message.dateTime,
        roomName : "Admin Room",
        conversationID : "562cd607b55fa039868cb94b",
        roomUsers : Room[0].Users
      })
    });
  });

  socket.on('leaveGroup', function (data) {
    var clients = io.sockets.sockets;
    for (var k in clients) {
      // we tell the client to execute 'new message'
      if (data.roomUsers.indexOf(clients[k].emailAddress) >= 0) {
        console.log('Socket message response to all users that' + data.userEmail + 'left a group');

        io.sockets.connected[clients[k].id].emit('leaveGroup', {
          userEmail: data.userEmail,
          conversationID: data.conversationID,
          dateTime: new Date(),
          roomName: data.roomName,
          roomUsers : data.roomUsers
        });
      }

      else {

      }
    }
  });
  socket.on('userAdded', function (data) {
    var clients = io.sockets.sockets;
    for (var k in clients) {
      // we tell the client to execute 'new message'
      if (data.roomUsers.indexOf(clients[k].emailAddress) >= 0) {
        console.log('Socket message response to all users that' + data.userEmail + 'joined a group');

        io.sockets.connected[clients[k].id].emit('userAdded', {
          userEmail: data.userEmail,
          conversationID: data.conversationID,
          dateTime: new Date(),
          roomName: data.roomName,
          roomUsers : data.roomUsers
        });
      }

      else {

      }
    }
  });
  socket.on('groupNameEdit', function (data) {
    var clients = io.sockets.sockets;
    for (var k in clients) {
      // we tell the client to execute 'new message'
      if (data.roomUsers.indexOf(clients[k].emailAddress) >= 0) {
        console.log('Socket message response to all users that' + data.roomName + 'is a group name now');

        io.sockets.connected[clients[k].id].emit('groupNameEdit', {
          userEmail: data.userEmail,
          conversationID: data.conversationID,
          dateTime: new Date(),
          roomName: data.roomName,
          roomUsers : data.roomUsers
        });
      }

      else {

      }
    }
  })
});
//app.listen(config.port);
console.log('Server is running at ' + config.port);
console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
