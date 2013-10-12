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
  callbackURL: "http://edhsieh.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'facebook.id': profile.id},function(err, user){
      if(err) {
        return done(err);
      } else if(!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          gender: profile.gender,
          facebook: {
            id: profile.id,
            accessToken: accessToken
          }
        });
      } else {
        user.name = profile.displayName,
        user.email = profile.emails[0].value,
        user.gender = profile.gender,
        user.facebook = {
          id: profile.id,
          accessToken: accessToken
        }
      }

      user.save(function(err) {
        if(err) {
          throw err;
        }
        return done(err, user);
      });
    });
  }
));
