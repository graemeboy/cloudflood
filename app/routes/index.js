var express = require('express');

/**
 * Controllers
 */

var user = require('../controllers/user')
  , campaign = require('../controllers/campaign')
  , index = require('../controllers/');
  //, auth = require('./middlewares/authorization')

module.exports = function (passport) {
  var router = express.Router();

  router.get('/logout', user.logout);
  router.post('/process-login', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Invalid email or password.'
  }), user.session);
  router.post('/process-signup', user.create);
  

  router.use('/dashboard', require('./dashboard'));
  router.use('/campaign', require('./campaign'));
    
  // should change to '/dashboard/process-campaign' on the frontend later
  router.post('/process-campaign', campaign.create);
    
  
  router.get('/', index.index);
  
  return router;
}
