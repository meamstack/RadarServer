var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, function(err, user) {
    done(err, user);
  });
});


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_MEETME_APIKEY,
  clientSecret: process.env.FACEBOOK_MEETME_APPSECRET,
  callbackURL: "http://meetme123.com:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('accessToken',accessToken)
    User.findOne({'facebook.id': profile.id},function(err, user){
      if(err) { return done(err); }
      var newUser = new User({
        name: profile.name,
        email: profile.email,
        gender: profile.gender
      });

      newUser.save(function(err) {
        if(err) {
          throw err;
        }
        return done(err, user);
      });
    });
  }
));