var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (app) {
  app.configure('development', function () {
    app.use(function staticsPlaceholder(req, res, next) {
        return next();
    });

    app.set('port', process.env.PORT || 9000);
    app.set('views', path.join(app.directory, '/app'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function middlewarePlaceholder(req, res, next) {
      return next();
    });

    app.use(app.router);
    app.use(express.errorHandler());

    mongoose.connect('mongodb://localhost/meetmeDev');
    var modelsPath = path.join(app.directory, '/server/models');
    fs.readdirSync(modelsPath).forEach(function (file) {
      require(modelsPath + '/' + file);
    });
  });

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

  var User = mongoose.model('User');

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
          // res.send('User saved successfully.');
        });
      });
      // User.findOrCreate(function(err, user) {
      //   if (err) { return done(err); }
      //   done(null, user);
      // });
    }
  ));


};


//passport session init

//db
//monogodb://localhost/collectionName

//handle errors