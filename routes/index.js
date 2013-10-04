var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports = function (app) {
  app.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  });

  app.post('#/login', function(req, res, next) {  // next is for promises
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
};
