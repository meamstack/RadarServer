var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var passport = require('passport');
var permissions = [ 'email'];//,
                    // 'user_photos',
                    // 'friends_photos',];


module.exports = function (app) {
  app.get('/', function(req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  });

  app.post('/api/createEvent', function(req, res, next) {
    var eventInfo = req.body;
    console.log(eventInfo);
    var loc = JSON.parse(eventInfo.location);
    Event.findOne({
      'name': eventInfo.name,
      'time': eventInfo.time
    }, function(err, event) {
      if(err) {
        throw err;
      } else if(!event) {
        event = new Event({
          name: eventInfo.name,
          description: eventInfo.description,
          location: [loc[0], loc[1]],
          time: eventInfo.time,
          photo: eventInfo.photo,
          activity: eventInfo.activity
        });
        event.save(function(err) {
          if(err) throw err;
          res.send('event create');
        });
      } else {
        res.send('already created');
      }
    });
  });

  app.post('/api/findEvents', function(req, res, next) {
    var options = req.body;
    var loc = JSON.parse(options.location);
    var maxDistance = options.maxD*111.12;  // 1000 meters
    var lonLat = {$geometry: {type: 'Point', coordinates: loc}};

    Event.find({ "location":
      { "$near": [-122.4,37.7],
        $maxDistance: maxDistance
      }
    }, function(err, data) {
      if(err) throw err;
      console.log(maxDistance);
      res.send(data);
    });
  });

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: permissions,
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });
};
