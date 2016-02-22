var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator');

var RegistrationSchema = new Schema({
  firstName: {type:String},
  lastName: {type:String},
  emailAddress: {type:String, required:true, unique:true},
  block: {type:Boolean},
  pinCode: {type:String},
  verificationCode: {type:String},
  isVerified: {type: Boolean},
  sessionToken: {type: String},
  role : {type: String},
  created_at: {type:Date},
  last_login: {type:Date},
  otherEmail : {type: Boolean}
});

mongoose.model('Registration', RegistrationSchema);
RegistrationSchema.plugin(uniqueValidator, { message: 'Error, Email match found' });
