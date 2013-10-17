var express = require('express');
var path = require('path');
var passport = require('passport');
var mongoStore = require('connect-mongo')(express);

module.exports = function (app, mongoose) {
  app.configure('development', function () {
    app.use(function staticsPlaceholder(req, res, next) {
        return next();
    });
    var allowCrossDomain = function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "content-type, accept");
      res.header("Access-Control-Max-Age", 10);
      res.header('Content-Type', "text/plain");
      next();
    }

    app.set('port', process.env.PORT || 9000);
    app.set('views', path.join(app.directory, '/app'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.static(app.directory+'/app'));
    app.use(express.logger('dev'));
    app.use(express.limit(100000000));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'raydar',
        store: new mongoStore({
            url: process.env.RADAR_MONGODB_TEST,
            collection: 'sessions',
            mongoose_connection: mongoose.connection
        })
    }));
    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function middlewarePlaceholder(req, res, next) {
      return next();
    });

    app.use(app.router);
    app.use(express.errorHandler());
  });
};

