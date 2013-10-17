var express = require('express');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/meetmeDev');
var db = {};

var app = express();
app.directory = __dirname;

require('./config/environments')(app, mongoose);


var modelsPath = path.join(app.directory, '/server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  var name = file.match(/^([a-z]+)\..+$/)[1];
  var name = name.charAt(0).toUpperCase() + name.slice(1);
  db[name] = require(modelsPath + '/' + file)();
});

require(path.join(app.directory, '/config/environments/passport.js'));

require('./routes')(app);

module.exports = {
  app: app,
  User: db.User,
  Event: db.Event
};
