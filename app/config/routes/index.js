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
  router.get('/dashboard', campaign.dashboard);
  
  router.post('/process-campaign', campaign.create);
  
  

  router.get('/campaign/:campaignId/twitter', campaign.postTwitter);
  router.get('/twitter/callback/', campaign.twitterCallback);
    
  router.param('campaignId', campaign.campaign);
  router.get('/campaign/:campaignId', campaign.display);
  router.get('/dashboard/settings', campaign.settings);
  router.get('/dashboard/campaign/new', campaign.make);
  router.get('/dashboard/:campaignId', campaign.details);
  router.get('/dashboard/:campaignId/edit', campaign.edit);
  router.get('/dashboard/:campaignId/stats', campaign.stats);
  //router.put('/dashboard/:campaignId', campaign.update);
  router.delete('/dashboard/:campaignId', campaign.destroy);
  
  
  // function to generate code block for user to put on their page
  
  // user hits post
  // authenticate user
  // post to feed
  // post callback
  // add data to stats model
  // return client callback
    
  
  router.get('/', index.index);
  
  return router;
}