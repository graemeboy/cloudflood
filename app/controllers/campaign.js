var mongoose = require('mongoose')
  , Campaign = mongoose.model('Campaign')
  , validator = require('validator');

/**
 * Show sign up form
 */

exports.create = function (req, res) {
  var camData = {};
  
  if (!validator.isNull(req.body['campaign-name'])) {
    camData.name = req.body['campaign-name'];
  }
  else {
    error = "Please enter a name.";
  }
  
  if (!validator.isNull(req.body['campaign-link']) && validator.isUrl(req.body['campaign-link'])) {
    camData.callback = req.body['campaign-link'];
  }
  else {
    error = "Please enter a valid callback URL.";
  }
  
  if (error) {
    req.flash('error', error);
    return res.redirect ('/dashboard');
  }
  
  camData.message = req.body["campaign-message"];
  camData.message_edit = req.body["campaign-message-edit"] === 'yes' ? true : false;
  camData.link = req.body["campaign-link"];
  camData.twitter = req.body["campaign-twitter"] === 'yes' ? true : false;
  camData.facebook = req.body["campaign-facebook"] === 'yes' ? true : false;
  
  
  var campaign = new Campaign(camData);
  campaign.user = req.user;

  campaign.save(function(err) {
    if (err) {
      req.flash('error', err)
      return res.redirect('/dashboard', {
        error: req.flash('error'),
        campaign: campaign
      });
    }
    
    req.flash('success', 'New Campaign created!');
    
    // set up campaign redirect
    //return res.redirect('/dashboard/'+campaign._id);
    })
}

exports.posted = function(req, res, next) {
  res.redirect(req.campaign.callback);
}

exports.campaign = function (req, res, next, id) {
  Campaign
    .findOne({ 'id' : id })
    .exec(function (err, campaign) {
      if (err) return next(err)
      if (!campaign) return next(new Error('Failed to load campaign ' + id))
      req.campaign = campaign
      next()
    })
}