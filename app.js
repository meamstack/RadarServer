var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();
app.directory = __dirname;

require('./config/environments')(app);
var mongoose = require('mongoose');

// mongoose connect
mongoose.connect('mongodb://localhost/meetmeDev');

var modelsPath = path.join(app.directory, '/server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  console.log(file);
  require(modelsPath + '/' + file);
});

require(path.join(app.directory, '/config/environments/passport.js'));

require('./routes')(app);

module.exports = {
  app: app

};
