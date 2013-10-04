module.exports = function (app) {
  app.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  });

  app.post('/login', function(req, res, next){
    var info = req.body;
    console.log(info);
    User.findOne({
      'name': info.name
    }, function(err, profile) {
      if(err) {
        throw err;
      } else if(profile) {
        // start a session with their info
      } else {
        profile.name = info.name;
        profile.email = info.email;
        profile.username = info.profile;
        profile.gender = info.gender;
      }
    });
  });
};
