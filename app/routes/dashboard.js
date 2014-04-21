var express = require('express')
  , campaign = require('../controllers/campaign')
  , dashboard = require('../controllers/dashboard')

var router = express.Router();

router.get('/', dashboard.index);
router.get('/settings', dashboard.settings);
router.get('/campaign/new', dashboard.make);
router.get('/:campaignId', dashboard.details);
router.get('/:campaignId/edit', dashboard.edit);
router.get('/:campaignId/stats', dashboard.stats);
router.delete('/:campaignId', dashboard.destroy);
router.post('/process-campaign', dashboard.create);


router.param('campaignId', campaign.campaign);

module.exports = router;