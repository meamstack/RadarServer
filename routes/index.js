var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var passport = require('passport');
var permissions = [ 'user_photos', 'email'];
var AWS = require('aws-sdk');


module.exports = function (app) {
  app.get('/', function(req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  });



//  ========================================================================
//  
//    app.post('/api/addPhoto', function(req, res, next) {
//      
//    console.log(req);
//    //console.log(req.content-type);
//    console.log('Body: ',req.body);
//    //var s3 = new AWS.S3({params: {Bucket: 'helenimages', Key: process.env.AWS_ACCESS_KEY_ID}});
//    var s3 = new AWS.S3({params: {Bucket: 'helenimages/test/william.json', Body: req.body}});
//    s3.createBucket(function() {
//      s3.putObject({Body: req.body}, function() {
//        console.log("Successfully uploaded data to myBucket/myKey");
//        res.send('success');
//      });
//    });
//  });
//  
//  ========================================================================








//  var addImage = function(image) {
//    var options = {
//      hostname: 'helenimages.s3.amazonaws.com',
//      port: 80,
//      method: 'POST'
//    };
//    var request = http.request(options,function(resposnse) {
//    response.on('data', function(chunk) {
//        console.log('add Image', chunk);
//      });
//    });
//  };
//  var s3 = new AWS.S3();
//    s3.createBucket({Bucket: 'douglas'}, function() {
//      var params = {Bucket: 'douglas', Key: proccess.env.AWS_ACCESS_KEY_ID, Body: 'Hello!'};
//      s3.putObject(params, function(err, data) {
//        if (err)
//          console.log(err)
//        else
//          console.log("Successfully uploaded data to myBucket/myKey");
//      });
//    });
//  });
//
//  var addImage = function(image) {
//    var options = {
//      hostname: 'helenimages.s3.amazonaws.com',
//      port: 80,
//      method: 'POST'
//    };
//    var request = http.request(options,function(resposnse) {
//    response.on('data', function(chunk) {
//        console.log('add Image', chunk);
//      });
//    });
//  };

  app.post('/api/createEvent', function(req, res, next) {
    console.log('in createEvent');
    var eventInfo = req.body;
    console.log(eventInfo, 'eventinfo');
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
          photo: eventInfo.photo,
          activity: eventInfo.activity,
          userId: eventInfo.userId
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
    //     $maxDistance: maxDistance,
    //   }, 
    // 'time': {
        // $gte: start
        // ,$lte: end
      // }
    }, function(err, data) {
      if(err) throw err;
      console.log(data);
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
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });
};
