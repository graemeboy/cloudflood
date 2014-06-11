var express = require('express')
  , campaign = require('../controllers/campaign') 
  , auth = require('../config/authentication')
  , dashboard = require('../controllers/dashboard')

var router = express.Router();

router.get('/', auth.requiresLogin, dashboard.index);
router.get('/settings', auth.requiresLogin, dashboard.settings);
router.get('/campaign/new', auth.requiresLogin, dashboard.make);
router.post('/process-campaign', auth.requiresLogin, dashboard.create);
router.get('/:campaignId', auth.requiresLogin, auth.user.hasAuthorization, dashboard.details);
router.get('/:campaignId/edit', auth.requiresLogin, auth.user.hasAuthorization, dashboard.edit);
router.get('/:campaignId/stats', auth.requiresLogin, auth.user.hasAuthorization, dashboard.stats);
router.delete('/:campaignId', auth.requiresLogin, auth.user.hasAuthorization, dashboard.destroy);

router.param('campaignId', campaign.campaign);

module.exports = router;