var async = require('async')
var express = require('express');

/**
 * Controllers
 */

var user = require('../../app/controllers/user')
  , index = require('../../app/controllers/index');
  //, auth = require('./middlewares/authorization')

var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});


module.exports = router;


  
/*
module.exports = function (app, passport) {
  var routes = express.Router();
  routes.get('/', function(req, res) {
   console.log("hello index");
   res.send("hello");
   });


  routes.get('/logout', user.logout)
  /* app.get('/user/:userId', auth.requiresLogin, auth.user.hasAuthorization, property.userProperties, design.getdesigns, user.store) */
  /* app.get('/user/:userId/profile', auth.requiresLogin, auth.user.hasAuthorization, property.userProperties, user.show) */
/*
  routes.post('/login', passport.authenticate('local', {
        failureFlash: true
    }), function (req,res) {
        res.send(req.user);
  });
  
  routes.post('/signup', user.signup);
*/

  /*
app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), user.signin)
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), property.initProperties, user.authCallback)
*/

  /* app.param('userId', user.user) */

  // home route
  //app.get('/', index.index)
  
//}