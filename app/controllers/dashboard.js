var mongoose = require('mongoose'),
    Campaign = mongoose.model('Campaign'),
    validator = require('validator'),
    config = require('../config/config');

exports.index = function(req, res) {  
  var user = req.user
  Campaign.find({'user': user._id}).exec(function (err, campaigns) {
    if (err) res.render('500');
    res.render('dashboard', {
        title: 'Campaigns',
        campaigns: campaigns
    })
  })
}

exports.settings = function(req, res, next) {
  req.render('dashboard/account');
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
    style: {
      fontType: "'Helvetica', sans-serif"
    },
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

exports.stats = function(req, res) {
    res.render('dashboard/stats', {
        campaign: req.campaign
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
    style.fontType = req.body['style-font'];
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
      
      var saveData = new Campaign(camData);
      saveData.user = req.user;
  } 
  
  
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

