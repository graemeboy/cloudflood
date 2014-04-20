var mongoose = require('mongoose')
  , Campaign = mongoose.model('Campaign')
  , validator = require('validator');

/**
 * Show sign up form
 */

exports.create = function (req, res) {
  var camData = {};
  var error
  
  if (!validator.isNull(req.body['campaign-name'])) {
    camData.name = req.body['campaign-name'];
  }
  else {
    error = "Please enter a name.";
  }
  console.log(req.body['campaign-link']);
  
  if (!validator.isNull(req.body['campaign-link']) && validator.isURL(req.body['campaign-link'])) {
    camData.callback = req.body['campaign-link'];
  }
  else {
    error = "Please enter a valid callback URL.";
  }
  
  if (error) {
    console.log(error);
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
      console.log("error!");
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.end("error"); // elaborate later.
      /*
req.flash('error', err)
      return res.redirect('/dashboard', {
        error: req.flash('error'),
        campaign: campaign
      });
*/
    } // if error
    // Success:
    else {
    console.log("success");
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(campaign._id.toString()); // return the ID number of the campaign
    
    //req.flash('success', 'New Campaign created!');
    
    }
    
    // set up campaign redirect
    //return res.redirect('/dashboard/'+campaign._id);
    })
}

exports.posted = function(req, res, next) {
  res.redirect(req.campaign.callback);
}

exports.display = function(req, res, next) {
  res.render('campaign', {
    campaign: req.campaign
  })
}

exports.edit = function(req, res, next) {
  res.render('dashboard/edit', {
    campaign: req.campaign
  })
}

exports.details = function (req, res, next) {
  res.render('dashboard/details', {
    campaign: req.campaign
  })
}

exports.stats = function (req, res, next) {
  res.render('dashboard/stats', {
    campaign: req.campaign
  })
}

exports.destroy = function (req, res, next) {
  var campaign = req.campaign
  campaign.remove(function(err) {
    if (err) req.flash('error', err); 
    req.flash('info', 'Deleted successfully.')
    return res.redirect('/dashboard');
  })
}

exports.update = function (req, res, next) {
  var campaign = req.campaign, 
  campaign = extend(campaign, req.body);
  
  campaign.save(function(err) {
    if (err) {
      req.flash('error', err);
      // redirect to campaign edit view.
      return res.redirect(('campaign/' + campaign._id + '/edit'), {
        //send errors and campaign
      })
    }
    
    //execute save function
    req.flash('success', 'Campaign saved.');
    //render campaign view
    //res.render(('campaign/' + campaign._id)
  })
}
  
exports.campaign = function (req, res, next, id) {
  Campaign
    .findOne({ '_id' : id })
    .exec(function (err, campaign) {
      if (err) return next(err)
      if (!campaign) return next(new Error('Failed to load campaign ' + id))
      req.campaign = campaign
      next()
    })
}