var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var permissions = [ 'email'];//,
                    // 'user_photos',
                    // 'friends_photos',];


module.exports = function (app) {
  app.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  });

  app.post('/login', function(req, res, next) {  // next is for promises
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

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: permissions,
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });
};
