var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema ({
  name: String,
  description: String,
  location: {lng: Number, lat: Number},
  // location: {type: [String], index: '2d'},
  time: Date,
  photo: Buffer,
  activity: String
});

EventSchema.index({'location': '2d'});
mongoose.model('Event', EventSchema);