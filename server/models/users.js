var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
  name: String,
  email: String,
  gender: String,
  facebook: {},
  eventsCreated: [Schema.Types.ObjectId],
  eventsSaved: [Schema.Types.ObjectId],
});

mongoose.model('User', UserSchema);
