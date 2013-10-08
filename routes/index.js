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
    var date = JSON.parse(options.date);
    console.log(options.date);
    var maxDistance = options.maxD;  // in degrees, if km is necessary, divide by 111.12
    // new Date(year, month, day [, hour, minutes, second, milli])
    var start =  new Date(date.year, date.month, date.day);

    var endDay = date.day + 3;
    var end =  new Date(date.year, date.month, endDay);

    start = start.toISOString();
    end = end.toISOString();

    Event.find({ 'location':
      { '$near': [loc[0], loc[1]],
        $maxDistance: maxDistance,
      }, 'time': {
        $gte: start,
        $lte: end
      }
    }, function(err, data) {
      if(err) throw err;
      console.log(maxDistance);
      console.log(loc[0], loc[1]);
      res.send(data);
    });
  });

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    display: 'touch',
    scope: permissions,
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });
};
