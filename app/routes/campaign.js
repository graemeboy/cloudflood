var express = require('express')
  , campaign = require('../controllers/campaign');


var router = express.Router();

router.param('campaignId', campaign.campaign);

router.get('/:campaignId', campaign.display);
router.get('/thankyou', campaign.endpoint);
router.get('/:campaignId/twitter', campaign.postTwitter);
router.get('/twitter/callback/', campaign.twitterCallback);  

module.exports = router;
