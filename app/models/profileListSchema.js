var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProfileListSchema = new Schema({
  job : [],
  hospitalName : [],
  doctor : [],
  nurse : [],
  professional : [],
  admin : [],
  updated_at : {type : Date}
});

mongoose.model('ProfileList', ProfileListSchema);

