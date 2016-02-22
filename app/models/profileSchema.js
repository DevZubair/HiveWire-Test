var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator');

var ProfileSchema = new Schema({
  userID : {type:String, unique:true},
  firstName: {type:String},
  lastName: {type:String},
  emailAddress: {type:String, required:true, unique:true},
  hospitalName: {type:String},
  grade: {type:String},
  speciality: {type: String},
  role : {type:String},
  gmcNumber : {type: String},
  job : {type: String},
  ward : {type: String},
  profilePic: {type:String},
  updated_at: {type: Date}
});

mongoose.model('Profiles', ProfileSchema);
ProfileSchema.plugin(uniqueValidator, { message: 'Error, Email match found' });
