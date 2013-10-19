var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var passport = require('passport');
var permissions = [ 'user_photos', 'email'];
var knox = require('knox');
var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: 'helenimages'
});

var s3addPhoto = function(eventId, photo) {
  photo = photo.slice(2);
  var jsonPic = {pic: photo};
  var req = client.put('/eventImages/'+eventId+'.json', {
    'Content-Length': JSON.stringify(jsonPic).length,
    'Content-Type': 'application/json'
  });
  req.on('response', function(res) {
    if(res.statusCode === 200) {
      console.log('saved to %s', req.url);
    }
  });
  jsonPic = JSON.stringify(jsonPic);
  req.end(jsonPic);  
};

module.exports = function (app) {
  app.get('/', function(req, res, next) {
    res.type('.html');
    res.render('index', {
      title: 'Express'
    });
  });

  app.post('/api/rsvp', function(req, res, next) {
    var uid = req.body.userId;
    var eid = req.body.eventId;
    Event.findOne({
      _id: eid
    }, function(err, event) {
      if(event.users.indexOf(uid) === -1){
        event.users.push(uid); 
      }
      event.save(function(err) {
        if(err) throw err;
        res.send('saved');
      });
    });
  });

  app.post('/login', function(req, res, next) {
    var cookie = req.cookies['connect.sid'];
    cookie = !!cookie;
    res.send(cookie);
  });


  app.post('/api/createEvent', function(req, res, next) {
    var eventInfo = req.body;
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
          location: eventInfo.location,
          time: eventInfo.time,
          //photo: eventInfo.photo,
          activity: eventInfo.activity,
          userId: eventInfo.userId
        });
        if(eventInfo.photo) s3addPhoto(event._id, eventInfo.photo);
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
    // var maxDistance = options.maxD;  // in degrees, if km is necessary, divide by 111.12
    // new Date(year, month, day [, hour, minutes, second, milli])
    var start =  new Date(options.date.year, options.date.month, options.date.day);
    // var endDay = JSON.stringify(+options.date.day + +1);
    // var end =  new Date(options.date.year, options.date.month, endDay);

    start = start.toISOString();
    // end = end.toISOString();

    Event.find({
      // 'location':
      // { '$near': options.location,
      //   $maxDistance: maxDistance,
      // },
      // 'time': {
      //   $gte: start
      //   ,$lte: end
//      }
    }, function(err, data) {
      if(err) throw err;
      res.send(data);
    });
  });

  app.get('/api/getUserData', function(req,res,next){
    User.findById(req.user._id, function(err, user) {
      if(err) {
        throw err;
      } else {
        res.send(user);
      }
    });
  });

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    display: 'touch',
    scope: permissions,
    failureRedirect: 'http://bing.com'
  }), function(req, res) { res.redirect('/'); });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: 'http://google.com'
  }), function(req, res) { res.redirect('/'); });
};
