var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var permissions = [ 'email',
                    'user_about_me',
                    // 'user_relationship_details',
                    'user_status',
                    // 'user_website',
                    'user_groups',
                    // 'user_photos',
                    // 'user_relationships',
                    'user_work_history',
                    // 'user_hometown',
                    'user_friends',
                    'user_activities',
                    // 'user_education_history',
                    // 'user_religion_politics',
                    'user_events',
                    'friends_about_me',
                    'friends_activities',
                    'friends_birthday',
                    'friends_interests',
                    'friends_relationships',
                    'friends_work_history',
                    'friends_events',
                    'user_actions.books',
                    'user_actions.video',
                    'user_actions.music',
                    'friends_actions.news',
                    'friends_education_history',
                    // 'friends_religion_politics',
                    // 'friends_subscriptions',
                    'friends_status',
                    // 'friends_hometown',
                    // 'friends_photos',
                    // 'friends_website',
                    // 'user_videos',
                    // 'friends_videos',
                    // 'user_questions',
                    // 'friends_questions',
                    'user_birthday',
                    // 'user_location',
                    // 'friends_location',
                    // 'user_games_activity',
                    // 'friends_online_presence',
                    // 'user_notes',
                    // 'publish_actions',
                    // 'user_subscriptions',
                    'user_likes',
                    'friends_likes'];


module.exports = function (app) {
  app.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  });

  app.post('/login', function(req, res, next) {  // next is for promises
    var info = req.body;

    User.findOne({
      'name': info.name
    }, function(err, profile) {
      // need else if when we already have that user in the DB
      // to send the information back
      if(err) {
        throw err;
      } else {
        var newProfile = new User({
          name: info.name,
          email: info.email,
          username: info.profile,
          gender: info.gender
        });

        newProfile.save(function(err) {
          if(err) {
            throw err;
          }
          res.send(info);
        });
      }
    });
  });

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: permissions,
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
  }), function(req,res){ res.redirect('/'); }); 


  // Redirect the user to Facebook for authentication.  When complete,
  // Facebook will redirect the user back to the application at
  //     /auth/facebook/callback
  // app.get('/auth/facebook', passport.authenticate('facebook'));

  // Facebook will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  // app.get('/auth/facebook/callback', 
  // passport.authenticate('facebook', { failureRedirect: '/' }), function(req,res){ res.redirect('/'); });
};
