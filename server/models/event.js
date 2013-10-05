var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema ({
  name: String,
  description: String,
  location: [Number],
  time: Date,
  photo: Buffer,
  activity: String
});

mongoose.model('Event', EventSchema);