var mongoose = require('mongoose'),
    Campaign = mongoose.model('Campaign'),
    validator = require('validator'),
    config = require('../config/config'),
	extend = require('lodash').extend;

/*
 * Render an overview page / a user dashboard
 */
exports.index = function(req, res) {  
  var user = req.user
  Campaign.find({'user': user._id}).exec(function (err, campaigns) {
    if (err) res.render('500');
    res.render('dashboard', {
        title: 'Campaigns',
        campaigns: campaigns
    }) // .render
  }) // .exec
} // .index

/*
 * Render a page where the user can edit account settings
 */
exports.settings = function(req, res, next) {
  req.render('dashboard/account');
} // .settings

/*
 * Render the page for making new campaigns.
 */
exports.make = function(req, res) {
    console.log("loading page for creating new campaigns");
    console.log("using default values:");
    console.log(defaultVals);
    res.render('dashboard/campaign', {
      title: 'Create a new campaign',
      button: 'Create New Campaign',
      campaign: defaultVals
    }); // render
} // make

/*
 * Render a page that displays details for a campaign,
 * such as ways to embed the buttons.
 */
exports.details = function(req, res) {
    console.log("rendering campaign details");
    res.render('dashboard/details', {
        campaign: req.campaign,
        info: req.flash('success')
    }) // .render
} // .details

/*
 * Create a list of default values for new campaigns.
 * Default values never change, expect if we change them here.
 */
var defaultVals = {
    name: '',
    message: 'Check out this site!',
    callback: '',
    logo: '',
    text: {
      security: 'We will never post without your permission!',
      paragraph: 'Before accessing this content, the author requests that you post a short message to your social network.',
      heading: 'Post a Message to Receive the Product'
    }, // text
    style: {
      fontType: "'Helvetica', sans-serif"
    } // style
    
    /*
     * We no longer store data about which campaign the user will use
     * Legacy:
        facebook: true,
        twitter: true
    */
} // defaultVals

/*
 * Fill in values for a template array, using keys from defaults.
 * Postcondition: values in data array are unchanged.
 * 
 * template can be from defaultVals
 * data can be data from the campaign
 */
var fillKeys = function (template, data) {
    // Create an array to keep all of the default keys
  var defaultKeys = Object.keys(template);
    // For each of these keys
    for (var i = 0; i < defaultKeys.length; i++) {
        if (data[defaultKeys[i]] !== undefined) {
            // if it is itself a JSON object
          if (data[defaultKeys[i]] instanceof Object) {
              // recurse on the object
              template[defaultKeys[i]] = 
                fillKeys(template[defaultKeys[i]], data[defaultKeys[i]]);
          } else {
            template[defaultKeys[i]] = data[defaultKeys[i]];
          } // else
        } // if
    } // for
    console.log("About to return template");
    console.log("default values are:");
    console.log(defaultVals);
    console.log("template values are:");
    console.log(template);
  return template;
} // fillKeys (array, array)

/*
 * Show a page for editing a campaign
 */
exports.edit = function(req, res) {
    console.log("Editing a campaign");
    
    // Begin by getting an array of the default values
    console.log("setting template to defaults. Defaults are:");
    console.log(defaultVals);
    // copy across, don't reference defaultVals
    var template = cloneObject(defaultVals);
    // Fill all keys present in defaults with data from the campaign
    var data = fillKeys(template, req.campaign);
    
    console.log("using campaign's template values:");
    console.log(data);
    
    console.log("req.campaign:");
    console.log(req.campaign);
    console.log("*Id is:* " + req.campaign['_id']);
    data['id'] = req.campaign['_id'];
    console.log(data);
    
    res.render('dashboard/campaign', {
      title: 'Edit your campaign',
      button: 'Edit Campaign',
      campaign: data
    }) // .render
} // .edit

function cloneObject (obj) {
 if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
    }
    return copy;
 }   
}

/*
 * Render a page for showing a single campaign's statistics
 */
exports.stats = function(req, res) {
    res.render('dashboard/stats', {
        campaign: req.campaign
    }) // .render
} // .stats

/*
 * Delete a campaign
 */
exports.destroy = function(req, res, next) {
    var campaign = req.campaign
    campaign.remove(function(err) {
        if (err) req.flash('error', err);
        req.flash('info', 'Deleted successfully.')
        return res.redirect('/dashboard');
    })
} // .destroy

function findUpdates(reqBody, dbEntry) {
	var result = [];
	for (key in reqBody) {
		if (typeof reqBody[key] == 'object' && typeof dbEntry[key] == 'object') {
			for (field in reqBody[key]) {
				if (reqBody[key][field] != dbEntry[key][field]) {
					result.push(key);
				}
			}
		}
		else if (reqBody[key] != dbEntry[key]) {
			result.push(key);
		}
	}
	return result;
}

/*
 * Save a new campaign to database from POST data.
 */
exports.create = function(req, res, next) {
    console.log("about to create a new campaign");
    var camData = {};
    var error;
    if (!validator.isNull(req.body['campaign-name'])) {
        camData.name = req.body['campaign-name'];
    } else {
        error = "Please enter a name.";
    } // else
    
    console.log("Its name is " + camData.name);
    
    if (!validator.isNull(req.body['campaign-redirect']) && validator.isURL(req.body['campaign-redirect'])) {
        camData.callback = req.body['campaign-redirect'];
    } else {
        error = "Please enter a valid callback URL.";
    } // else
    
    console.log("its callback url is: " + camData.callback);
    
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
    } else {
      camData.logo = '';
    } // else
    
    console.log("its logo url is: " + camData.logo);
    
    if (error) { 
        console.log("There was an error: " + error);
        req.flash('error', error);
        return res.redirect('/dashboard');
    } // if
    
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
    
    /*
     * We no longer receive data about which networks the user will use
     * Legacy:
        camData.twitter = req.body["campaign-twitter"] === 'yes' ? true : false;
        camData.facebook = req.body["campaign-facebook"] === 'yes' ? true : false;
    */

	console.log(req.body);
  if (req.body['campaign-id'] != undefined) {
        Campaign.findOne({
        '_id': req.body['campaign-id']
    }).exec(function(err, campaign) {
        if (err) return next(err)
        if (!campaign) return next(err)
        else {
			var updates = findUpdates(camData, campaign);
			console.log(updates);
			for (var i = 0; i < updates.length; i ++) {
				var key = updates[i];
				console.log(key);
				console.log(campaign[key]);
				campaign[key] = camData[key];
			}
			console.log(campaign);
			campaign.save();
			res.redirect('/dashboard/'+campaign._id);
        } // else
    }) // .exec
  } else {
      var saveData = new Campaign(camData);
      saveData.user = req.user;
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
        } // elsev
    }); // .save
  } // else

} 


