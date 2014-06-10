var mongoose = require('mongoose'),
    Campaign = mongoose.model('Campaign'),
    validator = require('validator'),
    config = require('../config/config'),
    twitterAPI = require('node-twitter-api');
    
var twitter = new twitterAPI({
  consumerKey: config.twitter.clientID,
  consumerSecret: config.twitter.clientSecret,
  callback: config.twitter.callback
});

exports.display = function(req, res, next) {
    res.render('campaign', {
        campaign: req.campaign
    })
}

exports.endpoint = function(req, res) {
  res.render('campaign-end', {
      callback: req.session.campaign.callback
  })

}

exports.twitterCallback = function (req, res, next) {
  twitter.getAccessToken(req.session.requestToken, req.session.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
    if (error) {
      req.flash('error', error);
    }
    else { 
      twitter.statuses('update', {
        status: req.session.campaign.message + ' - ' + req.session.campaign.link
      },
      accessToken,
      accessTokenSecret,
      function(error, data, response) {
        if (error) {
          console.log(error);
        }
        else {
          res.redirect('/campaign/thankyou');
        }
      })
    }
  })
}

exports.postTwitter = function(req, res, next) {
    req.session.campaign = req.campaign;
    //req.session.user_message = req.body.message;
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        if (error) {
            console.log("Error getting OAuth request token : " + error);
        } else {
          req.session.requestToken = requestToken;
          req.session.requestTokenSecret = requestTokenSecret;
          res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+ requestToken);
        }
    })
}

exports.campaign = function(req, res, next, id) {
    console.log(req);
    console.log("loading campaign, ID: " + req.id);
    Campaign.findOne({
        '_id': id
    }).exec(function(err, campaign) {
        if (err) return next(err)
        if (!campaign) return next(new Error('Failed to load campaign ' + id))
        req.campaign = campaign
        next()
    })
}
