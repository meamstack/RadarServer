var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports = function (app) {
  app.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  });

  app.post('/*', function(req, res, next) {  // next is for promises
    var info = req.body;

    User.findOne({
      'name': info.name
    }, function(err, profile) {
      // need else if when we already have that user in the DB
      // to send the information back
      if(err) {
        throw err;
      } else {
        var newProfile = new User({
          name: info.name,
          email: info.email,
          username: info.profile,
          gender: info.gender
        });

        newProfile.save(function(err) {
          if(err) {
            throw err;
          }
          res.send(info);
        });
      }
    });
  });

  // User.findOne({
  //     'name': 'mat'
  //   }, function(err, profile) {
  //     if(err) {
  //       throw err;
  //     } else if(profile) {
  //       // start a session with their info
  //     } else {
        // var profile = new User({
        //   name: 'matt',
        //   email: 'matt@gmail.com',
        //   username: 'matttt',
        //   gender: 'female'
        // });

        // profile.save(function(err) {
        //   if(err) {
        //     throw err;
        //   }

        //});
  //     }
  //   });
};
