var express = require('express')
  , campaign = require('../controllers/campaign');

module.exports = function () {
  var router = express.Router();
  
  router.get('/', campaign.dashboard);
  
  router.get('/settings', campaign.settings);
  router.get('/campaign/new', campaign.make);
  router.get('/:campaignId', campaign.details);
  router.get('/:campaignId/edit', campaign.edit);
  router.get('/:campaignId/stats', campaign.stats);
  //router.put('/dashboard/:campaignId', campaign.update);
  router.delete('/:campaignId', campaign.destroy);
  router.param('campaignId', campaign.campaign);
  
  return router;
}