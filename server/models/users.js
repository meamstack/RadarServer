var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
  var UserSchema = new Schema ({
    name: String,
    email: String,
    gender: String,
    facebook: {},
    eventsCreated: [Schema.Types.ObjectId],
    eventsSaved: [Schema.Types.ObjectId],
  });

  return mongoose.model('User', UserSchema);
};