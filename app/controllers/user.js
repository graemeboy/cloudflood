var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , validator = require('validator');

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/'
  delete req.session.returnTo
  res.redirect(redirectTo)
}

exports.signin = function (req, res) {}

/**
 * Show sign up form
 */

exports.create = function (req, res, next) {
  var user = new User(req.body);
  
  user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    
    
    /*
req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
*/

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    user.roles = ['authenticated'];
    user.save(function(err) {
        if (err) {
            return res.redirect('/', {
              
              //error: utils.errors(err.errors),
              user: user,
            })
        }
        req.logIn(user, function(err) {
            if (err) return next(err)
            return res.redirect('/');
        });
    });
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/')
}

/**
 * Session
 */

exports.session = login

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('user/show', {
    name: user.name,
    user: user  
  })
}

exports.user = function (req, res, next, email) {
  User
    .findOne({ 'email' : email })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}