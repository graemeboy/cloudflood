var mongoose = require('mongoose')
  , Campaign = mongoose.model('Campaign')
  , validator = require('validator');

/**
 * Show sign up form
 */

exports.create = function (req, res) {
  var campaign = new Campaign(req.body);
  campaign.user = req.user;

  campaign.save(function(err) {
    if (err) {
      res.render('/dashboard', {
        campaign: campaign,
        error: utils.errors(err.errors || err)
      });
    }
    
    req.flash('New Campaign created!');
    // set up campaign redirect
    //return res.redirect('/dashboard/'+campaign._id);
    })
}