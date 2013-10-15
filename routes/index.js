var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var passport = require('passport');
var knox = require('knox');
var permissions = [ 'user_photos', 'email'];
var fs = require('fs');

var AWS = require('aws-sdk');


module.exports = function (app) {

var addPhoto = function(photo, res) {
  var s3params = {region: 'us-west-2',
                  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                 };
  var client = knox.createClient({
          key: s3params.accessKeyId,
          secret: s3params.secretAccessKey,
          bucket: 'helenimages'
         });
  var s3PhotoSend = client.put('test/obj.txt', {
      'x-amz-acl': 'public-read',
      'Content-Length': photo.length,
      'Content-Type': 'text/plain'
    });

  s3PhotoSend.on('response', function(response) {
    if(200 === response.statusCode){
      console.log('saved to %s', s3PhotoSend.url);
    }
  });
console.log(typeof photo);
  s3PhotoSend.end(photo);
};
app.post('/api/addPhoto', function(req, res, next) {
  var photo = req.body;
console.log(photo, 'saving photo');
  addPhoto(photo, res); 
  res.send('photo saved');
});
/*
  app.post('/api/addPhoto',function(req, res, next) {
    console.log('running');
    var img;
    Event.find().exec(function(err,data){
      if(err) {
        throw err;
      } else {
    	img = data[0].photo;
        console.log('s3 is crazy',data[0].photo);
        //console.log('s3 is crazy',data[0].photo.buffer);
        //fs.readFileSync(data);
      }
    });
    var client = knox.createClient({key: s3params.accessKeyId,
		       secret: s3params.secretAccessKey,
		       bucket: 'helenimages'});
//    client.putFile(req.body,'helenimages/test/doug.jpg',function(err,response){
//      res.send(response);
//    });
    // var image = JSON.stringify(req.body);
    ///var image = JSON.parse(req.body.eventImg);
    var request = client.put('test/obj.jpg', {
      'x-amz-acl': 'public-read',
      //'Content-Length': img.length,
      'Content-Type': 'image/jpeg'
    });
    request.on('response', function(response) {
      if(200 === response.statusCode){
        console.log('saved to %s', req.url);
      }
      //console.log(response);
      //res.send('ok');
    });
    //console.log(image);
    request.end(img);
  });
*/

 // var addImage = function(image) {
 //   var options = {
 //     hostname: 'helenimages.s3.amazonaws.com',
 //     port: 80,
 //     method: 'POST'
 //   };
 //   var request = http.request(options,function(resposnse) {
 //   response.on('data', function(chunk) {
 //       console.log('add Image', chunk);
 //     });
 //   });
 // };

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
  addPhoto(eventInfo.photo);
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
//      console.log(data);
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
