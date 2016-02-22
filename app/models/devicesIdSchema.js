var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DeviceIdSchema = new Schema({
  emailAddress: {type:String},
  deviceID : {type:String},
  deviceType : {type : String},
  toSend : {type : Boolean},
  created_at: {type:Date}
});

mongoose.model('DeviceIdSchema', DeviceIdSchema);
