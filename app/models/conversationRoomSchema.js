var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator');

var Conversation_Room = new Schema({
  RoomIcon: {type:String},
  RoomName: {type:String},
  ChatMessages: [],
  Users: [],
  createDate : {type:Date}
});

mongoose.model('Conversation_Room',Conversation_Room);

