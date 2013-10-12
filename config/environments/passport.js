var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var https = require('https');

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
        console.log('no user');
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

      var options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: '/me?fields=picture.type(large)&access_token=' + accessToken,
        method: 'GET'
      };

      console.log('profile id ',profile.id);
      var FBreq = https.request(options, function(FBres) {
        console.log('in fbreq');

        var FBresults = '';
        FBres.on('data', function(d) {
          FBresults += d;
          console.log('getting data...');
        });

        FBres.on('end', function() {
          if(err) {
            console.log('error on fbres end');
            throw err;
          } else {
            FBresults = JSON.parse(FBresults);
            var keys = Object.keys(FBresults);
            for(var key in FBresults) {
              user.facebook[key] = FBresults[key];
            }
            console.log(user);
            user.save(function(err) {
              if (err) {
                throw err;
              }
            });
            return done(err, user);
          }
        });
      });

      FBreq.end();
      // user.save(function(err) {
      //   if (err) {
      //     throw err;
      //   }
      // });
      // return done(err, user);

    });
  }
));
