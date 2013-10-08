var app = require('./app.js');

require('http').createServer(app).listen(app.get('port'), function () {
    console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});

var fs = require('fs');

var file = fs.readFileSync(__dirname + '/test/mongoDB_data.json');
console.log(file.toString());
