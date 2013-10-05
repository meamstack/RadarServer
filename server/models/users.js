var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
  name: String,
  email: String,
  gender: String,
  eventsCreated: [Schema.Types.ObjectId],
  eventsSaved: [Schema.Types.ObjectId]
});

var EventSchema = new Schema ({
  name: String,
  description: String,
  location: [Number],
  time: Date,
  photo: Buffer,
  activity: String
});

mongoose.model('User', UserSchema);
mongoose.model('Event', EventSchema);
