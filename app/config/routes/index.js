var express = require('express');

/**
 * Controllers
 */

var user = require('../../../app/controllers/user')
  , campaign = require('../../../app/controllers/campaign')
  , index = require('../../../app/controllers/');
  //, auth = require('./middlewares/authorization')

module.exports = function (app, passport) {
  var router = express.Router();

  router.get('/logout', user.logout);
  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Invalid email or password.'
  }), user.session);
  router.post('/process-signup', user.create);
  router.get('/dashboard', function (req, res) {
    res.render('dashboard');
  });
  
  router.post('/dashboard/create', campaign.create)
  
  
  router.get('/', index.index);
  
  return router;
}