var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , validator = require('validator');

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/'
  delete req.session.returnTo
  res.redirect(redirectTo)
}

exports.signin = function (req, res) {console.log('in user signin')}

/**
 * Show sign up form
 */

exports.create = function (req, res, next) {
  
  if(!validator.isEmail(req.body.email)) {
    var error = "Please enter a valid email address.";
  }
  else if(!validator.isLength(req.body.password, 5, 20)) {
    var error = "Password must be between 5-20 characters long.";
  }
  else if (!validator.equals(req.body.password, req.body.passwordConf)) {
    var error = "Passwords do not match.";
  }
  
  if (error) {
    req.flash('error', error);
    return res.redirect('/');
  }
  else {
    var user = new User(req.body);
    
    user.roles = ['authenticated'];
  user.save(function(err) {
      if (err) {
          return res.redirect('/', {
            user: user,
          })
      }
      req.logIn(user, function(err) {
          if (err) return next(err)
          return res.redirect('/');
      });
  });
  }
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  return res.redirect('/')
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

exports.user = function (req, res, next, id) {
  User
    .findOne({ 'id' : email })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}