var mongoose = require('mongoose');
var Schema = mongoose.Schema;

console.log('user schema');

var UserSchema = new Schema ({
  name: String,
  email:String,
  username:String,
  gender:String
});

mongoose.model('User', UserSchema);