var appJs = require('./app.js');
var app = appJs.app;
var User = appJs.User;
var Event = appJs.Event;

require('http').createServer(app).listen(app.get('port'), function () {
    console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});


// export for tests
module.exports = {
  app: app,
  User: User,
  Event: Event
};

