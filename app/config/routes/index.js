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
  router.post('/process-login', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Invalid email or password.'
  }), user.session);
  router.post('/process-signup', user.create);
  router.get('/dashboard', function (req, res) {
    res.render('dashboard');
  });
  
  router.post('/process-campaign', campaign.create);
  
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'publish_actions'],
      failureRedirect: '/process-login'
    }), user.signin)
    
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/process-login'
    }), user.authCallback)
    
  
  
  //app.param('campaignId', campaign.campaign)
  //router.get('/campaign/:campaignId', campaign.show);
  
  // user hits post
  // authenticate user
  // post to feed
  // post callback
  // add data to stats model
  // return client callback
  
  //router.get('/campaign/:campaignId/process-post', campaign.posted);
  
  
  router.get('/', index.index);
  
  return router;
}