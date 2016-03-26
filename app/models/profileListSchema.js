var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProfileListSchema = new Schema({
  hospitalName: [],
  grade: [],
  speciality: [],
  role : [],
  job : [],
  ward : [],
  updated_at: {type: Date}
});

mongoose.model('ProfileList', ProfileListSchema);

