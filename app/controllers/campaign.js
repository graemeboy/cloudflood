var mongoose = require('mongoose'),
    Campaign = mongoose.model('Campaign'),
    validator = require('validator'),
    config = require('../config/config'),
    twitterAPI = require('node-twitter-api');
    
        var twitter = new twitterAPI({
        consumerKey: config.twitter.clientID,
        consumerSecret: config.twitter.clientSecret,
        callback: 'http://localhost:3000/twitter/callback/'
    });
/**
 * Show sign up form
 */
exports.create = function(req, res) {
    var camData = {};
    var error
    if (!validator.isNull(req.body['campaign-name'])) {
        camData.name = req.body['campaign-name'];
    } else {
        error = "Please enter a name.";
    }
    if (!validator.isNull(req.body['campaign-redirect']) && validator.isURL(req.body['campaign-redirect'])) {
        camData.callback = req.body['campaign-redirect'];
    } else {
        error = "Please enter a valid callback URL.";
    }
    if (error) {
        console.log(error);
        req.flash('error', error);
        return res.redirect('/dashboard');
    }
    camData.message = req.body["campaign-message"];
    var text = {};
    text.heading = req.body["campaign-heading"];
    text.paragraph = req.body["campaign-paragraph"];
    text.security = req.body["campaign-security"];
    camData.text = text;
    var style = {};
    style.headingColor = req.body['style-color-heading'];
    style.paragraphColor = req.body['style-color-paragraph'];
    style.securityColor = req.body['style-color-security'];
    style.backgroundColor = req.body['style-color-background'];
    style.messageColor = req.body['style-color-message'];
    camData.style = style;
    camData.message_edit = req.body["campaign-message-edit"] === 'yes' ? true : false;
    camData.link = req.body["campaign-link"];
    camData.twitter = req.body["campaign-twitter"] === 'yes' ? true : false;
    camData.facebook = req.body["campaign-facebook"] === 'yes' ? true : false;
    var campaign = new Campaign(camData);
    campaign.user = req.user;
    campaign.save(function(err) {
        if (err) {
            console.log("error!");
            res.writeHead(200, {
                "Content-Type": "text/plain"
            });
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
            /*
console.log("success");
            res.writeHead(200, {
                "Content-Type": "text/plain"
            });
            res.end(campaign._id.toString()); 
*/// return the ID number of the campaign
            req.flash('success', 'New Campaign created!');
            res.redirect('/dashboard/'+campaign._id);
        }
        // set up campaign redirect
        //
    })
}

exports.dashboard = function(req, res) {  
  var user = req.user
  Campaign.find({'user': user._id}).exec(function (err, campaigns) {
    if (err) res.render('500');
    res.render('dashboard', {
        title: 'Campaigns',
        campaigns: campaigns
    })
  })
}

exports.display = function(req, res, next) {
    res.render('campaign', {
        campaign: req.campaign
    })
}

exports.edit = function(req, res, next) {
    res.render('dashboard/campaign', {
        title: 'Edit your campaign',
        campaign: req.campaign
    })
}

exports.make = function(req, res, next) {
    res.render('dashboard/campaign', {
      title: 'Create a new campaign'
    });
}

exports.details = function(req, res, next) {
    res.render('dashboard/details', {
        campaign: req.campaign,
        info: req.flash('success')
    })
}
exports.stats = function(req, res, next) {
    res.render('dashboard/stats', {
        campaign: req.campaign
    })
}


exports.twitterCallback = function (req, res, next) {
  twitter.getAccessToken(req.session.requestToken, req.session.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
    if (error) {
      req.flash('error', error);
    }
    else { 
      twitter.statuses('update', {
        status: req.session.campaign.message
      },
      accessToken,
      accessTokenSecret,
      function(error, data, response) {
        if (error) {
          req.flash('error', error);
        }
        else {
          
        }
      })
    }
  })
}

exports.postTwitter = function(req, res, next) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        if (error) {
            console.log("Error getting OAuth request token : " + error);
        } else {
          req.session.campaign = req.campaign;
          req.session.requestToken = requestToken;
          req.session.requestTokenSecret = requestTokenSecret;
          res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+ requestToken);
        }
    })
}

exports.destroy = function(req, res, next) {
    var campaign = req.campaign
    campaign.remove(function(err) {
        if (err) req.flash('error', err);
        req.flash('info', 'Deleted successfully.')
        return res.redirect('/dashboard');
    })
}
exports.update = function(req, res, next) {
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

exports.settings = function(req, res, next) {
  req.render('dashboard/account');
}

exports.campaign = function(req, res, next, id) {
    Campaign.findOne({
        '_id': id
    }).exec(function(err, campaign) {
        if (err) return next(err)
        if (!campaign) return next(new Error('Failed to load campaign ' + id))
        req.campaign = campaign
        next()
    })
}