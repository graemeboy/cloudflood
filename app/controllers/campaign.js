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
 
exports.create = function(req, res, next) {

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
    
    if (!validator.isNull(req.body['campaign-logo'])) {
      camData.logo = req.body['campaign-logo'];
      /*
if (validator.isURL(req.body['campaign-logo'])) {
        camData.logo = req.body['campaign-logo'];
      }
      else {
        error = "Please enter a valid logo URL.";
      }
*/
    }
    else {
      camData.logo = '';
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
    style.headingColor = req.body['style-color-heading'] == 'undefined' ? '' : req.body['style-color-heading'];
    style.paragraphColor = req.body['style-color-paragraph'] == 'undefined' ? '' : req.body['style-color-paragraph'];
    style.securityColor = req.body['style-color-security'] == 'undefined' ? '' : req.body['style-color-security'];
    style.backgroundColor = req.body['style-color-background'] == 'undefined' ? '' : req.body['style-color-background'];
    style.messageColor = req.body['style-color-message'] == 'undefined' ? '' : req.body['style-color-message'];
    camData.style = style;
    camData.message_edit = req.body["campaign-message-edit"] === 'yes' ? true : false;
    camData.link = req.body["campaign-link"];
    camData.twitter = req.body["campaign-twitter"] === 'yes' ? true : false;
    camData.facebook = req.body["campaign-facebook"] === 'yes' ? true : false;
    
    
  if (req.body['campaign-id'] != undefined) {
        Campaign.findOne({
        '_id': req.body['campaign-id']
    }).exec(function(err, campaign) {
        if (err) return next(err)
        if (!campaign) return next(err)
        else {
          var saveData = extend(campaign, camData);
        }
    })
  }
  else {
      console.log('hello')
      var saveData = new Campaign(camData);
      saveData.user = req.user;
  } 
  
  console.log(saveData)
  saveData.save(function(err){
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
            res.redirect('/dashboard/'+saveData._id);
        }
    });
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

var defaultVals = {
    name: '',
    message: 'Check out this site!',
    callback: '',
    logo: '',
    text: {
      security: 'We will never post without your permission!',
      paragraph: 'Before accessing this content, the author requests that you post a short message to your social network.',
      heading: 'Post a Message to Receive the Product'
    },
    style: {},
    facebook: true,
    twitter: true
    
}

var fillKeys = function (template, data) {
  var defaultKeys = Object.keys(template);
  for (var i = 0; i < defaultKeys.length; i++) {
    if (data[defaultKeys[i]] !== undefined) {
      if (data[defaultKeys[i]] instanceof Object) {
        template[defaultKeys[i]] = fillKeys(template[defaultKeys[i]], data[defaultKeys[i]]);
      }
      else {
        template[defaultKeys[i]] = data[defaultKeys[i]]
      }
    }
  }
  return template;
}

exports.edit = function(req, res) {

  var template = defaultVals;
  var data = fillKeys(template, req.campaign);
    
  res.render('dashboard/campaign', {
      title: 'Edit your campaign',
      button: 'Edit Campaign',
      campaign: data
  })
}

exports.make = function(req, res) {
    res.render('dashboard/campaign', {
      title: 'Create a new campaign',
      button: 'Create New Campaign',
      campaign: defaultVals
    });
}

exports.details = function(req, res) {
    res.render('dashboard/details', {
        campaign: req.campaign,
        info: req.flash('success')
    })
}
exports.stats = function(req, res) {
    res.render('dashboard/stats', {
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
        status: req.session.campaign.message
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