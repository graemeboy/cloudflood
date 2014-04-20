var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    // need to set text to 140 chars

/**
 * Campaign Schema
 */
var CampaignSchema = new Schema({
    name: String,
    message: String,
    message_edit: Boolean,
    text: {},
    style: {},
    link: String,
    callback: String,
    user: {type : Schema.ObjectId, ref : 'User'},
    twitter: Boolean,
    facebook: Boolean
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

// The 4 validations below only apply if you are signing up traditionally.

CampaignSchema.path('name').validate(function(name) {
    return (typeof name === 'string' && name.length > 0);
}, 'Name cannot be blank');

CampaignSchema.path('message').validate(function(message) {
    return (typeof message === 'string' && message.length > 0);
}, 'Message cannot be blank');

CampaignSchema.path('callback').validate(function(callback) {
    if (!this.provider) return true;
    return (typeof callback === 'string' && callback.length > 0);
}, 'Callback link cannot be blank');


/**
 * Pre-save hook
 */
CampaignSchema.pre('save', function(next) {
    if (!this.isNew) {return next();}
    
    else
        next();
});

mongoose.model('Campaign', CampaignSchema);