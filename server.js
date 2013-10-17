var app = require('./app.js').app;

require('http').createServer(app).listen(app.get('port'), function () {
    console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});

module.exports = {
  app: require('./app.js').app
  // ,
  // User: db.User,
  // Event: db.Event
};

