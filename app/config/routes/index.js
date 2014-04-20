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
    res.render('dashboard', {
      error: req.flash('error')
    });
  });
  
  router.post('/process-campaign', campaign.create);
  
  router.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'publish_actions'],
      failureRedirect: '/process-login'
    }), user.signin)
    
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/process-login'
    }), user.authCallback)
    
  router.param('campaignId', campaign.campaign);
  router.get('/:campaignId', campaign.display);
  router.get('/dashboard/:campaignId', campaign.details);
  router.get('/dashboard/:campaignId/edit', campaign.edit);
  router.get('/dashboard/:campaignId/stats', campaign.stats);
  router.put('/dashboard/:campaignId', campaign.update);
  router.delete('/dashboard/:campaignId', campaign.destroy);
  
  
  // function to generate code block for user to put on their page
  
  // user hits post
  // authenticate user
  // post to feed
  // post callback
  // add data to stats model
  // return client callback
  
  router.get('/campaign/:campaignId/process-post', campaign.posted);
  
  
  router.get('/', index.index);
  
  return router;
}