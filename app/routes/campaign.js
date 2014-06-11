var express = require('express')
  , campaign = require('../controllers/campaign');

var router = express.Router();

router.get('/:campaignId', campaign.display);
router.get('/thankyou', campaign.endpoint);
router.get('/:campaignId/twitter', campaign.postTwitter);
router.get('/twitter/callback/', campaign.twitterCallback);  
router.get('/:campaignId/facebook', campaign.postFacebook);
router.get('/facebook/callback', campaign.facebookCallback);


router.param('campaignId', campaign.campaign);

module.exports = router;
