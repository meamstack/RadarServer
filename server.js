var app = require('./app.js').app;

require('http').createServer(app).listen(app.get('port'), function () {
    console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});


// export for tests
module.exports = {
  app: require('./app.js').app,
  User: require('./app.js').db.User,
  Event: require('./app.js').db.Event
};

