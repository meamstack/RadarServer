var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema ({
  name: String,
  description: String,
  // location: [],
  location: {type: [], index: '2d'},
  time: Date,
  photo: Buffer,
  activity: String,
  userId: String
});

// EventSchema.index({location: '2d'});
mongoose.model('Event', EventSchema);
