var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
  var EventSchema = new Schema ({
    name: String,
    description: String,
    // location: [],
    location: {type: [], index: '2d'},
    time: Date,
    photo: String,
    activity: String,
    userId: String,
    users: []
  });

  // EventSchema.index({location: '2d'});
  return mongoose.model('Event', EventSchema);
};
